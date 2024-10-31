/**
 * External dependencies
 */
import type { TaskPreset } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isTaskPresetLoaderOpen( state: State ): boolean {
	return state.presetLoader.isOpen;
} //end isTaskPresetLoaderOpen()

export function getTaskPresetSelection(
	state: State
): ReadonlyArray< TaskPreset[ 'id' ] > {
	return state.presetLoader.selection;
} //end getTaskPresetSelection()
