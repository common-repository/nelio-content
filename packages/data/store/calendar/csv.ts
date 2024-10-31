/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type {
	Dict,
	EditorialTask,
	Item,
	ItemSummary,
	ItemType,
	Maybe,
	Post,
	SocialMessage,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';

export function toCSV(
	state: State,
	type: ItemSummary[ 'type' ],
	item: Maybe< Item >
): string {
	const attributes = attributesToPull( type );
	if ( isEmpty( attributes ) || isEmpty( item ) ) {
		return '';
	} //end if

	const rowValues = attributes.map( ( attr ) => {
		const value = (
			'string' === typeof attr
				? ( item as Dict )[ attr ]
				: attr( state, item )
		) as string;
		return escape( value || 'N/A' );
	} );

	return `"${ rowValues.join( '","' ) }"\n`;
} //end toCSV()

// ========
// INTERNAL
// ========

function attributesToPull(
	type: ItemType
): ReadonlyArray< string | ( ( state: State, item: Item ) => string ) > {
	if ( 'post' === type ) {
		return [
			'date',
			'typeName',
			postAuthor,
			'title',
			'permalink',
			'status',
		];
	} //end if

	if ( 'social' === type ) {
		return [
			'schedule',
			'network',
			profileName,
			'textComputed',
			relatedPostPermalink,
			'status',
		];
	} //end if

	if ( 'task' === type ) {
		const taskString = () => _x( 'Task', 'text', 'nelio-content' );
		return [
			'dateDue',
			taskString,
			taskAssignee,
			'task',
			'',
			taskCompletion,
		];
	} //end if

	return [];
} //end attributesToPull()

function escape( text = '' ) {
	return text.replace( /"/g, '""' );
} //end escape()

function postAuthor( state: State, item: Item ) {
	if ( ! isPost( item ) ) {
		return '';
	} //end if
	const user = state.entities.authors[ item.author ];
	return user?.name || '';
} //end postAuthor()

function profileName( state: State, item: Item ) {
	if ( ! isSocialMessage( item ) ) {
		return '';
	} //end if
	const p = state.social.profiles.byId[ item.profileId ];
	return p?.username || p?.displayName || '';
} //end profileName()

function relatedPostPermalink( state: State, item: Item ) {
	if ( ! isSocialMessage( item ) ) {
		return '';
	} //end if

	if ( ! item.postId ) {
		return '';
	} //end if

	const post = state.entities.posts[ item.postId ];
	return post?.permalink || '';
} //end relatedPostPermalink()

function taskAssignee( state: State, item: Item ) {
	if ( ! isEditorialTask( item ) ) {
		return '';
	} //end if
	const user = state.entities.authors[ item.assigneeId ];
	return user?.name || '';
} //end taskAssignee()

function taskCompletion( _: unknown, item: Item ) {
	return isEditorialTask( item ) && item.completed
		? _x( 'Completed', 'text (task)', 'nelio-content' )
		: _x( 'Pending', 'text (task)', 'nelio-content' );
} //end taskCompletion()

const isPost = ( i: Item ): i is Post => !! i.id;

const isSocialMessage = ( i: Item ): i is SocialMessage => !! i.id;

const isEditorialTask = ( i: Item ): i is EditorialTask => !! i.id;
