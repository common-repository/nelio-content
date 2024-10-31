/**
 * External dependencies
 */
import type { Maybe, TaskPreset, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State, PresetLoader } from '../types';

export function isEditorialTaskBeingDeleted(
	state: State,
	taskId: Uuid
): boolean {
	return state.tasks.deleting.includes( taskId );
} //end isEditorialTaskBeingDeleted()

export function isEditorialTaskBeingSynched(
	state: State,
	taskId: Uuid
): boolean {
	return state.tasks.synching.includes( taskId );
} //end isEditorialTaskBeingSynched()

export function isRetrievingEditorialTasks( state: State ): boolean {
	return !! state.tasks.isRetrievingTasks;
} //end isRetrievingEditorialTasks()

export function getTaskPresetSelection(
	state: State
): ReadonlyArray< TaskPreset[ 'id' ] > {
	return state.tasks.preset?.selection ?? [];
} //end getTaskPresetSelection()

export function getTaskPresetLoaderState(
	state: State
): Maybe< PresetLoader[ 'state' ] > {
	return state.tasks.preset?.state;
} //end getTaskPresetLoaderState()
