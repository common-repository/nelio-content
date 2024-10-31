/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Post, PostId } from '@nelio-content/types';

export type PostAction = RemovePostAction | ReceivePostsAction;

export function receivePosts(
	posts: Post | ReadonlyArray< Post >
): ReceivePostsAction {
	return {
		type: 'RECEIVE_POSTS',
		posts: castArray( posts ),
	};
} //end receivePosts()

export function removePost( postId: PostId ): RemovePostAction {
	return {
		type: 'REMOVE_POST',
		postId,
	};
} //end removePost()

// ============
// HELPER TYPES
// ============

type ReceivePostsAction = {
	readonly type: 'RECEIVE_POSTS';
	readonly posts: ReadonlyArray< Post >;
};

type RemovePostAction = {
	readonly type: 'REMOVE_POST';
	readonly postId: PostId;
};
