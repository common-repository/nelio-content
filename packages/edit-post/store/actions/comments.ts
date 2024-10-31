/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

export type CommentsAction =
	| SetEditorialCommentInputValueAction
	| MarkEditorialCommentAsSynchingAction
	| MarkEditorialCommentAsDeletingAction;

export function setEditorialCommentInputValue(
	value: string
): SetEditorialCommentInputValueAction {
	return {
		type: 'SET_EDITORIAL_COMMENT_INPUT_VALUE',
		value,
	};
} //end setEditorialCommentInputValue()

export function markEditorialCommentAsSynching(
	commentId: Uuid,
	isSynching: boolean
): MarkEditorialCommentAsSynchingAction {
	return {
		type: 'MARK_EDITORIAL_COMMENT_AS_SYNCHING',
		commentId,
		isSynching,
	};
} //end markEditorialCommentAsSynching()

export function markEditorialCommentAsDeleting(
	commentId: Uuid,
	isDeleting: boolean
): MarkEditorialCommentAsDeletingAction {
	return {
		type: 'MARK_EDITORIAL_COMMENT_AS_DELETING',
		commentId,
		isDeleting,
	};
} //end markEditorialCommentAsDeleting()

// ============
// HELPER TYPES
// ============

type SetEditorialCommentInputValueAction = {
	readonly type: 'SET_EDITORIAL_COMMENT_INPUT_VALUE';
	readonly value: string;
};

type MarkEditorialCommentAsSynchingAction = {
	readonly type: 'MARK_EDITORIAL_COMMENT_AS_SYNCHING';
	readonly commentId: Uuid;
	readonly isSynching: boolean;
};

type MarkEditorialCommentAsDeletingAction = {
	readonly type: 'MARK_EDITORIAL_COMMENT_AS_DELETING';
	readonly commentId: Uuid;
	readonly isDeleting: boolean;
};
