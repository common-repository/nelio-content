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

export async function getSocialMessagesRelatedToPost(
	postId: PostId
): Promise< void > {
	await resolveSelect( NC_DATA ).getPostRelatedItems( postId );
} //end getSocialMessagesRelatedToPost()

export async function getSocialMessageIdsRelatedToPost(
	postId: PostId
): Promise< void > {
	await getSocialMessagesRelatedToPost( postId );
} //end getSocialMessageIdsRelatedToPost()
