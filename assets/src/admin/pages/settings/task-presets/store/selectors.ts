/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual, trim } from 'lodash';
import type { Maybe, TaskPreset, TaskTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export function getTaskPresets(
	state: State
): ReadonlyArray< TaskPreset[ 'id' ] > {
	return state.taskPresets.allIds;
} //end getTaskPresets()

export function getTaskPreset(
	state: State,
	presetId: Maybe< TaskPreset[ 'id' ] >
): Maybe< TaskPreset > {
	return presetId ? state.taskPresets.byId[ presetId ] : undefined;
} //end getTaskPreset()

export function isTaskTemplateEditorOpen( state: State ): boolean {
	return !! state.editor;
} //end isTaskTemplateEditorOpen()

export function getEditingTaskSource( state: State ): Maybe< {
	readonly presetId: TaskPreset[ 'id' ];
	readonly source: TaskTemplate;
} > {
	if ( ! state.editor ) {
		return undefined;
	} //end if

	const { presetId, source } = state.editor;
	return { presetId, source };
} //end getEditingTaskSource()

export function getEditingTask( state: State ): TaskTemplate {
	return state.editor?.attrs || DEFAULT_ATTRS;
} //end getEditingTask()

export function isEditingTaskDirty( state: State ): boolean {
	if ( ! state.editor ) {
		return false;
	} //end if

	const { source } = state.editor;
	const attrs = {
		...state.editor.attrs,
		task: trim( state.editor.attrs.task ),
	};
	return ! isEqual( source, attrs );
} //end isEditingTaskDirty()

export function getEditingTaskError( state: State ): Maybe< string > {
	if ( ! state.editor ) {
		return undefined;
	} //end if

	const { attrs } = state.editor;
	if ( trim( attrs.task ) === '' ) {
		return _x( 'Please write a valid task', 'user', 'nelio-content' );
	} //end if

	if ( trim( attrs.dateValue ) === '' ) {
		return _x( 'Please set a valid date', 'user', 'nelio-content' );
	} //end if

	return undefined;
} //end getEditingTaskError()

export function isSavingPresets( state: State ): boolean {
	return state.saving;
} //end isSavingPresets()

// =======
// HELPERS
// =======

const DEFAULT_ATTRS: TaskTemplate = {
	task: '',
	color: 'none',
	dateType: 'predefined-offset',
	dateValue: '0',
	assigneeId: undefined,
};
