/**
 * WordPress dependencies
 */
import { resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getTasksRelatedToPost( postId: PostId ): Promise< void > {
	await resolveSelect( NC_DATA ).getPostRelatedItems( postId );
} //end getTasksRelatedToPost()

export async function getTaskIdsRelatedToPost(
	postId: PostId
): Promise< void > {
	await getTasksRelatedToPost( postId );
} //end getTaskIdsRelatedToPost()
