/**
 * External dependencies
 */
import type {
	RecurrenceContext,
	RecurrenceSettings,
} from '@nelio-content/types';

export type RecurrenceAction =
	| EnableRecurrence
	| EditRecurrenceSettings
	| SetRecurrenceSettings
	| SetRecurrenceContext;

export function enableRecurrence( enabled: boolean ): EnableRecurrence {
	return {
		type: 'ENABLE_RECURRENCE',
		enabled,
	};
} //end enableRecurrence()

export function editRecurrenceSettings(
	editing: boolean
): EditRecurrenceSettings {
	return {
		type: 'EDIT_RECURRENCE_SETTINGS',
		editing,
	};
} //end editRecurrenceSettings()

export function setRecurrenceSettings(
	settings: RecurrenceSettings
): SetRecurrenceSettings {
	return {
		type: 'SET_RECURRENCE_SETTINGS',
		settings,
	};
} //end setRecurrenceSettings()

export function setRecurrenceContext(
	context: Partial< RecurrenceContext >
): SetRecurrenceContext {
	return {
		type: 'SET_RECURRENCE_CONTEXT',
		context,
	};
} //end setRecurrenceContext()

// ============
// HELPER TYPES
// ============

type EnableRecurrence = {
	readonly type: 'ENABLE_RECURRENCE';
	readonly enabled: boolean;
};

type EditRecurrenceSettings = {
	readonly type: 'EDIT_RECURRENCE_SETTINGS';
	readonly editing: boolean;
};

type SetRecurrenceSettings = {
	readonly type: 'SET_RECURRENCE_SETTINGS';
	readonly settings: RecurrenceSettings;
};

type SetRecurrenceContext = {
	readonly type: 'SET_RECURRENCE_CONTEXT';
	readonly context: Partial< RecurrenceContext >;
};
