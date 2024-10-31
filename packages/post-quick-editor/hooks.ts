/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { PostTypeContext, Taxonomy } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from './store';

export const useIsDisabled = (): boolean => {
	const isSaving = useIsSaving();
	const canEdit = useCanEditPost();
	return isSaving || ! canEdit;
};

export const useIsPublished = (): boolean =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).isPublished() );

export const useIsSubscribed = (): boolean =>
	useSelect( ( select ) => select( NC_DATA ).isSubscribed() );

export const useIsSaving = (): boolean =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).isSaving() );

export const useIsNew = (): boolean =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).isNewPost() );

export const useCanEditPost = (): boolean =>
	useSelect( ( select ): boolean => {
		const { getPost, canCurrentUserEditPost } = select( NC_DATA );
		const { getId, isNewPost } = select( NC_POST_EDITOR );
		const id = getId();
		const post = !! id && getPost( id );
		const canEdit = !! post && canCurrentUserEditPost( post );
		return isNewPost() || canEdit;
	} );

export const useSupportsTaxonomies = (): boolean =>
	!! useSupportedTaxonomies().length;

export const useSupportedTaxonomies = (): ReadonlyArray< Taxonomy > => {
	const postType = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getPostType()
	);
	const taxonomies = useAllTaxonomies();
	return filter(
		taxonomies,
		( t ) => ! postType || t.types.includes( postType )
	);
}; //end useTaxonomies()

export const useIsFeatureEnabled = ( context: PostTypeContext ): boolean =>
	useSelect( ( select ) => {
		const type = select( NC_POST_EDITOR ).getPostType();
		const types = select( NC_DATA ).getPostTypes( context );
		return types.some( ( t ) => t.name === type );
	} );

export const useMayHaveExtraInfo = (): boolean =>
	[
		useSupportsTaxonomies(),
		useIsFeatureEnabled( 'future-actions' ),
		useIsFeatureEnabled( 'tasks' ),
		useIsFeatureEnabled( 'comments' ),
		useIsFeatureEnabled( 'references' ),
	].some( ( x ) => x );

// =======
// HELPERS
// =======

const useAllTaxonomies = () =>
	filter(
		useSelect(
			( select ): Taxonomy[] =>
				select( CORE ).getEntityRecords( 'root', 'taxonomy', {
					per_page: -1,
				} ) || []
		),
		( t ) => t.visibility.public
	);
