/**
 * External dependencies
 */
import { values } from 'lodash';
import type { Maybe, TaskPreset } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getTaskPresets( state: State ): ReadonlyArray< TaskPreset > {
	return values( state.entities.taskPresets );
} //end getTaskPresets()

export function getTaskPreset(
	state: State,
	presetId: TaskPreset[ 'id' ]
): Maybe< TaskPreset > {
	return state.entities.taskPresets[ presetId ];
} //end getTaskPresets()
