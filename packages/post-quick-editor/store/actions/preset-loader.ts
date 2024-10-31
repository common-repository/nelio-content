/**
 * External dependencies
 */
import type { TaskPreset } from '@nelio-content/types';

export type TaskPresetAction = OpenTaskPresetLoader | SelectTaskPresets;

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

// ============
// HELPER TYPES
// ============

type OpenTaskPresetLoader = {
	readonly type: 'OPEN_TASK_PRESET_LOADER';
	readonly isOpen: boolean;
};

type SelectTaskPresets = {
	readonly type: 'SELECT_TASK_PRESETS';
	readonly selection: ReadonlyArray< TaskPreset[ 'id' ] >;
};
