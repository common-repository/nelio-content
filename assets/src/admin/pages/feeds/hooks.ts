/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { PostTypeContext } from '@nelio-content/types';

export const usePostTypeContext = (): PostTypeContext =>
	useSelect( ( select ) =>
		select( NC_DATA ).getPostTypes( 'calendar' ).length
			? 'calendar'
			: 'content-board'
	);
