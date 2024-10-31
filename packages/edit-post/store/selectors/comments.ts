/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getEditorialCommentInputValue( state: State ): string {
	return state.comments.input;
} //end getEditorialCommentInputValue()

export function isDeletingEditorialComment(
	state: State,
	commentId: Uuid
): boolean {
	return state.comments.deleting.includes( commentId );
} //end isDeletingEditorialComment()

export function isSynchingEditorialComment(
	state: State,
	commentId: Uuid
): boolean {
	return state.comments.synching.includes( commentId );
} //end isSynchingEditorialComment()

export function isRetrievingEditorialComments( state: State ): boolean {
	return state.comments.isRetrievingComments;
} //end isRetrievingEditorialComments()
