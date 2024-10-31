/**
 * External dependencies
 */
import type { TaskPreset } from '@nelio-content/types';

export type TaskPresetAction = ResetTaskPresets;

export function resetTaskPresets(
	presets: ReadonlyArray< TaskPreset >
): ResetTaskPresets {
	return {
		type: 'RESET_TASK_PRESETS',
		presets,
	};
} //end receiveTaskPresets()

// ============
// HELPER TYPES
// ============

type ResetTaskPresets = {
	readonly type: 'RESET_TASK_PRESETS';
	readonly presets: ReadonlyArray< TaskPreset >;
};
