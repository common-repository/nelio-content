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

export async function getCommentsRelatedToPost(
	postId: PostId
): Promise< void > {
	await resolveSelect( NC_DATA ).getPostRelatedItems( postId );
} //end getCommentsRelatedToPost()

export async function getCommentIdsRelatedToPost(
	postId: PostId
): Promise< void > {
	await getCommentsRelatedToPost( postId );
} //end getCommentIdsRelatedToPost()
