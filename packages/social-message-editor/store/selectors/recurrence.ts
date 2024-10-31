/**
 * EExternal dependencies
 */
import type {
	RecurrenceContext,
	RecurrenceSettings,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getRecurrenceMode(
	state: State
): State[ 'recurrence' ][ 'mode' ] {
	return state.recurrence.mode;
} //end getRecurrenceMode()

export function isRecurrenceEnabled( state: State ): boolean {
	return state.recurrence.enabled;
} //end isRecurrenceEnabled()

export function isEditingRecurrenceSettings( state: State ): boolean {
	return state.recurrence.editing;
} //end isEditingRecurrenceSettings()

export function getRecurrenceSettings( state: State ): RecurrenceSettings {
	return state.recurrence.settings;
} //end getRecurrenceSettings()

export function getRecurrenceContext( state: State ): RecurrenceContext {
	return state.recurrence.context;
} //end getRecurrenceContext()
