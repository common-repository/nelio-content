/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { EditorialComment, Uuid } from '@nelio-content/types';

export type CommentAction = RemoveCommentAction | ReceiveCommentsAction;

export function receiveComments(
	comments: EditorialComment | ReadonlyArray< EditorialComment >
): ReceiveCommentsAction {
	return {
		type: 'RECEIVE_COMMENTS',
		comments: castArray( comments ),
	};
} //end receiveComments()

export function removeComment( commentId: Uuid ): RemoveCommentAction {
	return {
		type: 'REMOVE_COMMENT',
		commentId,
	};
} //end removeComment()

// ============
// HELPER TYPES
// ============

type ReceiveCommentsAction = {
	readonly type: 'RECEIVE_COMMENTS';
	readonly comments: ReadonlyArray< EditorialComment >;
};

type RemoveCommentAction = {
	readonly type: 'REMOVE_COMMENT';
	readonly commentId: Uuid;
};
