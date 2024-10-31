/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';
import { applyFilters } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import { omitBy, toPairs, uniq } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { isDefined, isEmpty, logError, setValue } from '@nelio-content/utils';
import type {
	EditorialComment,
	EditorialReference,
	EditorialTask,
	Post,
	PostId,
	PremiumItem,
	PremiumItems,
	PremiumItemType,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../../store';
import type { State } from '../../types';

export async function saveAndClose(): Promise< void > {
	const isSaving = select( NC_POST_EDITOR ).isSaving();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NC_POST_EDITOR ).markAsSaving( true );

	try {
		const { tasks, premiumItemsByType, newComments, ...unsavedPost } =
			select( NC_POST_EDITOR ).getAllAttributes();

		const { post, references: refs } = await savePost( unsavedPost );
		await saveTasks( ! unsavedPost.id, post, tasks );
		await savePremiumItemsByType(
			! unsavedPost.id,
			post,
			premiumItemsByType
		);
		await saveNewComments( post, newComments );

		await dispatch( NC_DATA ).receivePosts( post );
		await dispatch( NC_DATA ).receiveSuggestedReferences( post.id, refs );
		await dispatch( NC_DATA ).reloadPostRelatedItems( post.id );
	} catch ( e ) {
		logError( e );
	} //end catch

	await dispatch( NC_POST_EDITOR ).markAsSaving( false );
	await dispatch( NC_POST_EDITOR ).close();
} //end saveAndClose()

// =======
// HELPERS
// =======

type Response = {
	readonly post: Post;
	readonly references: ReadonlyArray< EditorialReference >;
};

async function savePost(
	post: Omit<
		State[ 'attributes' ],
		'premiumItemsByType' | 'tasks' | 'newComments'
	>
): Promise< Response > {
	const method = ! post.id ? 'POST' : 'PUT';
	const path = ! post.id
		? '/nelio-content/v1/post'
		: `/nelio-content/v1/post/${ post.id }`;
	const result = apiFetch< Response >( {
		path,
		method,
		data: {
			...omitBy( post, isEmpty ),
			references: post.references.map( ( r ) => r.url ),
		},
	} );

	await saveDefaultTime( post );

	return result;
} //end savePost()

async function saveDefaultTime( {
	timeValue,
}: Omit<
	State[ 'attributes' ],
	'premiumItemsByType' | 'tasks' | 'newComments'
> ) {
	if ( ! timeValue ) {
		return;
	} //end if
	await dispatch( NC_DATA ).setDefaultTime( 'post', timeValue );
	setValue( 'defaultPostTime', timeValue );
} //end saveDefaultTime()

async function saveTasks(
	isNew: boolean,
	post: Post,
	tasks: ReadonlyArray< EditorialTask >
): Promise< void > {
	const oldTasks = ! isNew
		? await resolveSelect( NC_DATA ).getTasksRelatedToPost( post.id )
		: [];

	const isDirty = select( NC_POST_EDITOR ).areTasksDirty( oldTasks );
	if ( ! isDirty ) {
		return;
	} //end if

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		await apiFetch< ReadonlyArray< EditorialTask > >( {
			url: `${ apiRoot }/site/${ siteId }/task`,
			method: 'POST',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: {
				mode: 'replace',
				postId: post.id,
				tasks: tasks.map( ( t ) => ( {
					...t,
					baseDatetime: post.date || 'none',
					assigneeId: t.assigneeId || post.author,
					postId: post.id,
					postType: post.type,
					postAuthor: post.author,
				} ) ),
			},
		} );
	} catch ( e ) {
		logError( e );
	} //end catch()

	oldTasks.forEach( ( { id } ) => dispatch( NC_DATA ).removeTask( id ) );
} //end saveTasks()

async function savePremiumItemsByType(
	isNew: boolean,
	post: Post,
	premiumItemsByType: State[ 'attributes' ][ 'premiumItemsByType' ]
): Promise< void > {
	const allOldItems = ! isNew
		? await resolveSelect( NC_DATA ).getAllPremiumItemsRelatedToPost(
				post.id
		  )
		: {};

	type ItemDiff = {
		readonly old: ReadonlyArray< PremiumItem >;
		readonly new: ReadonlyArray< PremiumItem >;
	};

	const types = uniq( [
		...Object.keys( premiumItemsByType ),
		...Object.keys( allOldItems ),
	] ) as ReadonlyArray< PremiumItemType >;
	const itemPairs = recordToPairs(
		types.reduce(
			( r, type ) => ( {
				...r,
				[ type ]: {
					old: allOldItems[ type ] ?? [],
					new: premiumItemsByType[ type ] ?? [],
				},
			} ),
			{} as Record< PremiumItemType, ItemDiff >
		)
	);

	const dirtyItems = itemPairs.filter( ( [ type, { old } ] ) =>
		select( NC_POST_EDITOR ).arePremiumItemsDirty( type, old )
	);

	const savedItems = await Promise.all(
		dirtyItems.map(
			async ( [ type, items ] ): Promise<
				[ PremiumItemType, ItemDiff ]
			> => [
				type,
				{
					old: items.old,
					new: await savePremiumItems( type, items.new, post.id ),
				},
			]
		)
	);

	const { receivePremiumItems, removePremiumItem } = dispatch( NC_DATA );
	savedItems.forEach( ( [ type, items ] ) => {
		items.old.forEach( ( i ) => removePremiumItem( type, i.id ) );
		void receivePremiumItems( type, items.new );
	} );
} //end savePremiumItemsByType()

function recordToPairs< R >(
	record: Record< PremiumItemType, R >
): ReadonlyArray< Readonly< [ PremiumItemType, R ] > > {
	return toPairs( record )
		.map( ( [ type, items ] ) =>
			items ? ( [ type, items ] as const ) : undefined
		)
		.filter( isDefined );
} //end recordToPairs()

function savePremiumItems< Type extends PremiumItemType >(
	typeName: Type,
	items: ReadonlyArray< PremiumItems[ Type ] >,
	postId: PostId
): Promise< ReadonlyArray< PremiumItems[ Type ] > > {
	if ( ! items.length ) {
		return new Promise( ( r ) => r( [] ) );
	} //end if

	return applyFilters(
		'nelio-content_post-quick-editor_onSavePremiumItems',
		new Promise( ( r ) => r( [] ) ),
		typeName,
		items,
		postId
	) as Promise< ReadonlyArray< PremiumItems[ Type ] > >;
} //end savePremiumItems()

async function saveNewComments(
	post: Post,
	newComments: ReadonlyArray< EditorialComment >
) {
	newComments = newComments.map( ( c ) => ( {
		...c,
		postId: post.id,
		postType: post.type,
		postAuthor: post.author,
	} ) );

	const isDirty = !! newComments.length;
	if ( ! isDirty ) {
		return;
	} //end if

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		await apiFetch< ReadonlyArray< EditorialComment > >( {
			url: `${ apiRoot }/site/${ siteId }/comment`,
			method: 'POST',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: newComments,
		} );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end saveNewComments()
