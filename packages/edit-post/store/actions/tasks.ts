/**
 * External dependencies
 */
import type { TaskPreset, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { PresetLoader } from '../types';

export type TasksAction =
	| MarkEditorialTaskAsSynchingAction
	| MarkEditorialTaskAsDeletingAction
	| OpenTaskPresetLoader
	| SelectTaskPresets
	| SetTaskPresetsState;

export function markEditorialTaskAsSynching(
	taskId: Uuid,
	isSynching: boolean
): MarkEditorialTaskAsSynchingAction {
	return {
		type: 'MARK_EDITORIAL_TASK_AS_SYNCHING',
		taskId,
		isSynching,
	};
} //end markEditorialTaskAsSynching()

export function markEditorialTaskAsDeleting(
	taskId: Uuid,
	isDeleting: boolean
): MarkEditorialTaskAsDeletingAction {
	return {
		type: 'MARK_EDITORIAL_TASK_AS_DELETING',
		taskId,
		isDeleting,
	};
} //end markEditorialTaskAsDeleting()

export function openTaskPresetLoader( isOpen: boolean ): OpenTaskPresetLoader {
	return {
		type: 'OPEN_TASK_PRESET_LOADER',
		isOpen,
	};
} //end openTaskPresetLoader()

export function selectTaskPresets(
	selection: ReadonlyArray< TaskPreset[ 'id' ] >
): SelectTaskPresets {
	return {
		type: 'SELECT_TASK_PRESETS',
		selection,
	};
} //end selectTaskPresets()

export function setTaskPresetsState(
	state: PresetLoader[ 'state' ]
): SetTaskPresetsState {
	return {
		type: 'SET_TASK_PRESETS_STATE',
		state,
	};
} //end isetTaskPresetsState()

// ============
// HELPER TYPES
// ============

type MarkEditorialTaskAsSynchingAction = {
	readonly type: 'MARK_EDITORIAL_TASK_AS_SYNCHING';
	readonly taskId: Uuid;
	readonly isSynching: boolean;
};

type MarkEditorialTaskAsDeletingAction = {
	readonly type: 'MARK_EDITORIAL_TASK_AS_DELETING';
	readonly taskId: Uuid;
	readonly isDeleting: boolean;
};

type OpenTaskPresetLoader = {
	readonly type: 'OPEN_TASK_PRESET_LOADER';
	readonly isOpen: boolean;
};

type SelectTaskPresets = {
	readonly type: 'SELECT_TASK_PRESETS';
	readonly selection: ReadonlyArray< TaskPreset[ 'id' ] >;
};

type SetTaskPresetsState = {
	readonly type: 'SET_TASK_PRESETS_STATE';
	readonly state: PresetLoader[ 'state' ];
};
