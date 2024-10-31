/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { store as CORE } from '@safe-wordpress/core-data';
import type { Type as PostType } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { filter, map, uniq } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type {
	Maybe,
	Post,
	PostId,
	PostTypeName,
	Taxonomy,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';
import type { RelatedPostStatus } from '../store/types';

export const useIsLoadingRelatedPost = (): boolean =>
	useSelect(
		( select ) =>
			'loading' === select( NC_SOCIAL_EDITOR ).getRelatedPostStatus().type
	);

export const useRelatedPost = (): [
	Maybe< Post >,
	( post: PostId ) => void,
] => {
	const post = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getPost()
	);
	const { setPost: doSetPost } = useDispatch( NC_SOCIAL_EDITOR );
	const setPost = useSelect( ( select ) => ( postId: PostId ) => {
		const newPost = select( NC_DATA ).getPost( postId );
		if ( ! newPost ) {
			return;
		} //end if
		void doSetPost( newPost );
	} );
	return [ post, setPost ];
};

export const useRelatedPostId = (): Maybe< PostId > =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).getPostId() );

export const useRelatedPostType = (): Maybe< PostTypeName > =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).getPostType() );

export const useIsRelatedPostHidden = (): boolean =>
	useSelect( ( select ) => {
		const context = select( NC_SOCIAL_EDITOR ).getEditorContext();
		const isExistingMessage = ! select( NC_SOCIAL_EDITOR ).isNewMessage();
		const hasRelatedPost =
			'none' !== select( NC_SOCIAL_EDITOR ).getRelatedPostStatus().type;
		return (
			'calendar' !== context || ( isExistingMessage && ! hasRelatedPost )
		);
	} );

export const useRelatedPostStatus = (): RelatedPostStatus =>
	useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getRelatedPostStatus()
	);

export const useExistingMessages = (): {
	readonly published: ReadonlyArray< string >;
	readonly pending: ReadonlyArray< string >;
} =>
	useSelect( ( select ) => {
		const { getPostId } = select( NC_SOCIAL_EDITOR );
		const postId = getPostId();
		if ( ! postId ) {
			return {
				published: [],
				pending: [],
			};
		} //end if

		const { getSocialMessagesRelatedToPost } = select( NC_DATA );
		const messages = getSocialMessagesRelatedToPost( postId );

		const published = filter( messages, ( m ) => m.status === 'publish' );
		const pending = filter( messages, ( m ) => m.status !== 'publish' );

		return {
			published: uniq( map( published, 'text' ) ),
			pending: uniq( map( pending, 'text' ) ),
		};
	} );

export const useIsLoadingPreviousMessages = (): boolean =>
	useSelect( ( select ) => {
		const postId = select( NC_SOCIAL_EDITOR ).getPostId();
		const isLoading = select( NC_DATA ).isResolving(
			'getPostRelatedItems',
			[ postId ]
		);

		return !! postId && isLoading;
	} );

export const usePostSupports = (
	feat: 'author' | 'excerpt',
	post: Maybe< Post >
): boolean =>
	useSelect( ( select ) => {
		const { getEntityRecord } = select( CORE );
		const typeName = post?.type;
		const type: Maybe< PostType > = typeName
			? getEntityRecord( 'root', 'postType', typeName )
			: undefined;
		switch ( feat ) {
			case 'author':
				return !! type?.supports?.author;
			case 'excerpt':
				return !! type?.supports?.excerpt;
			default:
				return false;
		} //end switch
	} );

export const useSupportedTaxonomies = (
	post: Maybe< Post >
): ReadonlyArray< Taxonomy > =>
	useSelect( ( select ): ReadonlyArray< Taxonomy > => {
		const { getEntityRecords } = select( CORE );
		const taxonomies: Taxonomy[] =
			getEntityRecords( 'root', 'taxonomy', { per_page: -1 } ) ?? [];
		return taxonomies
			.filter( ( t ): t is Taxonomy => !! t )
			.filter(
				( tax ) =>
					tax.visibility.public &&
					tax.types.includes( post?.type ?? '' )
			);
	} );
