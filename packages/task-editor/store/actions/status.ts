/**
 * External dependencies
 */
import { omitBy, isNil } from 'lodash';
import { createTask } from '@nelio-content/utils';
import type { EditorialTask, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { EditorContext, Post, RelatedPostStatus } from '../types';

export type StatusAction =
	| OpenEditorAction
	| CloseAction
	| SetValidationErrorAction
	| SetPostAction
	| SetRelatedPostStatusAction
	| MarkAsSavingAction;

export function openExistingTaskEditor(
	task: EditorialTask,
	options: OpenEditorAction[ 'options' ]
): OpenEditorAction {
	return {
		type: 'OPEN_EDITOR',
		task,
		isNewTask: false,
		options,
	};
} //end openExistingTaskEditor()

export function openNewTaskEditor(
	attrs: Partial< EditorialTask >,
	options: OpenEditorAction[ 'options' ]
): OpenEditorAction {
	return {
		type: 'OPEN_EDITOR',
		task: {
			...createTask(),
			...omitBy( attrs, isNil ),
		},
		isNewTask: true,
		options,
	};
} //end openNewTaskEditor()

export function setPost( post: Maybe< Post > ): SetPostAction {
	return {
		type: 'SET_POST',
		post,
	};
} //end setPost()

export function close(): CloseAction {
	return {
		type: 'CLOSE_EDITOR',
	};
} //end close()

export function setRelatedPostStatus(
	status: RelatedPostStatus
): SetRelatedPostStatusAction {
	return {
		type: 'SET_RELATED_POST_STATUS',
		status,
	};
} //end setRelatedPostStatus()

export function setValidationError( error: string ): SetValidationErrorAction {
	return {
		type: 'SET_VALIDATION_ERROR',
		error,
	};
} //end setValidationError()

export function markAsSaving( isSaving: boolean ): MarkAsSavingAction {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

// =======
// HELPERS
// =======

export type OpenEditorAction = {
	readonly type: 'OPEN_EDITOR';
	readonly task: EditorialTask;
	readonly isNewTask: boolean;
	readonly options: {
		readonly post: Maybe< Post >;
		readonly context: EditorContext;
		readonly onSave?: ( task: EditorialTask ) => void;
	};
};

type CloseAction = {
	readonly type: 'CLOSE_EDITOR';
};

type SetPostAction = {
	readonly type: 'SET_POST';
	readonly post: Maybe< Post >;
};

type SetRelatedPostStatusAction = {
	readonly type: 'SET_RELATED_POST_STATUS';
	readonly status: RelatedPostStatus;
};

type SetValidationErrorAction = {
	readonly type: 'SET_VALIDATION_ERROR';
	readonly error: string;
};

type MarkAsSavingAction = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};
