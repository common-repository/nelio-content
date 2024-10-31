/**
 * External dependencies
 */
import { omitBy, isNil } from 'lodash';
import { createPost } from '@nelio-content/utils';
import type { NewPost, Post, PostTypeContext } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { ExtraInfoTab } from '../types';

export type StatusAction =
	| OpenEditor
	| Close
	| SetExtraInfoTab
	| SetValidationError
	| MarkAsSaving;

export function openNewPostEditor(
	context: PostTypeContext,
	attrs: Partial< NewPost > = {}
): OpenEditor {
	return {
		type: 'OPEN_EDITOR',
		post: {
			...createPost( context ),
			...omitBy( attrs, isNil ),
		},
	};
} //end openNewPostEditor()

export function openPostEditor( post: Post ): OpenEditor {
	return {
		type: 'OPEN_EDITOR',
		post,
	};
} //end openPostEditor()

export function close(): Close {
	return {
		type: 'CLOSE_EDITOR',
	};
} //end close()

export function setExtraInfoTab( tab: ExtraInfoTab ): SetExtraInfoTab {
	return {
		type: 'SET_EXTRA_INFO_TAB',
		tab,
	};
} //end setExtraInfoTab()

export function setValidationError( error: string ): SetValidationError {
	return {
		type: 'SET_VALIDATION_ERROR',
		error,
	};
} //end setValidationError()

export function markAsSaving( isSaving: boolean ): MarkAsSaving {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

// ============
// HELPER TYPES
// ============

export type OpenEditor = {
	readonly type: 'OPEN_EDITOR';
	readonly post: Post | NewPost;
};

type Close = {
	readonly type: 'CLOSE_EDITOR';
};

type SetExtraInfoTab = {
	readonly type: 'SET_EXTRA_INFO_TAB';
	readonly tab: ExtraInfoTab;
};

type SetValidationError = {
	readonly type: 'SET_VALIDATION_ERROR';
	readonly error: string;
};

type MarkAsSaving = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};
