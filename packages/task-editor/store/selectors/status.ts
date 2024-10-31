/**
 * External dependencies
 */
import type { Maybe, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { EditorContext, Post, RelatedPostStatus, State } from '../types';

export function isNewTask( state: State ): boolean {
	return !! state.status.isNewTask;
} //end isNewTask()

export function isVisible( state: State ): boolean {
	return !! state.status.isVisible;
} //end isVisible()

export function isSaving( state: State ): boolean {
	return !! state.status.isSaving;
} //end isSaving()

export function getValidationError( state: State ): string {
	return state.status.error;
} //end getValidationError()

export function getPost( state: State ): Maybe< Post > {
	return state.status.relatedPost.post;
} //end getPost()

export function getPostId( state: State ): Maybe< PostId > {
	return state.status.relatedPost.post?.id;
} //end getPostId()

export function getRelatedPostStatus( state: State ): RelatedPostStatus {
	return state.status.relatedPost.status;
} //end getRelatedPostStatus()

export function getEditorContext( state: State ): EditorContext {
	return state.status.context;
} //end getEditorContext()

export function isDirty( state: State ): boolean {
	const { source: prevTask } = state.status;
	const { attributes: task } = state;
	const dirty =
		prevTask?.task !== task.task ||
		prevTask?.assigneeId !== task.assigneeId ||
		prevTask?.dateType !== task.dateType ||
		prevTask?.dateValue !== task.dateValue ||
		prevTask?.color !== task.color;

	return ! state.status.isNewTask && dirty;
} //end isDirty()

export function getCustomOnSave( state: State ): State[ 'status' ][ 'onSave' ] {
	return state.status.onSave;
} //end getCustomOnSave()
