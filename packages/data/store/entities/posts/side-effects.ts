/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function reloadPostRelatedItems(
	postId?: PostId
): Promise< void > {
	await dispatch( NC_DATA ).invalidateResolution( 'getPostRelatedItems', [
		postId,
	] );
	await dispatch( NC_DATA ).invalidateResolution(
		'getAllPremiumItemsRelatedToPost',
		[ postId ]
	);
	await resolveSelect( NC_DATA ).getPostRelatedItems( postId );
} //end reloadPostRelatedItems()
