/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { PostTypeContext } from '@nelio-content/types';

export const useAreContentToolsEnabled = (): boolean =>
	useSelect( ( select ) => {
		const type = select( NC_EDIT_POST ).getPostType();
		const { getPostTypes } = select( NC_DATA );
		const types = [
			...getPostTypes( 'comments' ),
			...getPostTypes( 'efi' ),
			...getPostTypes( 'future-actions' ),
			...getPostTypes( 'notifications' ),
			...getPostTypes( 'quality-checks' ),
			...getPostTypes( 'references' ),
			...getPostTypes( 'tasks' ),
		];
		return types.some( ( t ) => t.name === type );
	} );

export const useIsFeatureEnabled = ( context: PostTypeContext ): boolean =>
	useSelect( ( select ) => {
		const type = select( NC_EDIT_POST ).getPostType();
		const types = select( NC_DATA ).getPostTypes( context );
		return types.some( ( t ) => t.name === type );
	} );
