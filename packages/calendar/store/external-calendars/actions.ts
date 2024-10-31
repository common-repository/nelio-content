/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { ExternalCalendar, Url } from '@nelio-content/types';

export type Action =
	| ManageExternalCalendars
	| RemoveExternalCalendarAction
	| OpenExternalCalendarEditorAction
	| CloseExternalCalendarEditorAction
	| SetEditingExternalCalendarUrlAction
	| SetEditingExternalCalendarNameAction
	| MarkAsSavingAction
	| MarkAsDeletingAction
	| ReceiveExternalCalendarsAction;

export function manageExternalCalendars(
	isActive: boolean
): ManageExternalCalendars {
	return {
		type: 'MANAGE_EXTERNAL_CALENDARS',
		isActive,
	};
} //end manageExternalCalendars()

export function removeExternalCalendar(
	url: Url
): RemoveExternalCalendarAction {
	return {
		type: 'REMOVE_EXTERNAL_CALENDAR',
		url,
	};
} //end removeExternalCalendar()

export function openExternalCalendarEditor(
	calendar?: ExternalCalendar
): OpenExternalCalendarEditorAction {
	return {
		type: 'OPEN_EXTERNAL_EDITOR_CALENDAR',
		url: calendar?.url ?? ( '' as Url ),
		name: calendar?.name ?? '',
	};
} //end openExternalCalendarEditor()

export function closeExternalCalendarEditor(): CloseExternalCalendarEditorAction {
	return {
		type: 'CLOSE_EXTERNAL_CALENDAR_EDITOR',
	};
} //end closeExternalCalendarEditor()

export function setEditingExternalCalendarUrl(
	url: string
): SetEditingExternalCalendarUrlAction {
	return {
		type: 'SET_EDITING_EXTERNAL_CALENDAR_URL',
		url,
	};
} //end setEditingExternalCalendarUrl()

export function setEditingExternalCalendarName(
	name: string
): SetEditingExternalCalendarNameAction {
	return {
		type: 'SET_EDITING_EXTERNAL_CALENDAR_NAME',
		name,
	};
} //end setEditingExternalCalendarName()

export function markAsSaving( isSaving: boolean ): MarkAsSavingAction {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

export function markAsDeleting(
	url: Url,
	isDeleting: boolean
): MarkAsDeletingAction {
	return {
		type: 'MARK_AS_DELETING',
		url,
		isDeleting,
	};
} //end markAsDeleting()

export function receiveExternalCalendars(
	externalCalendars: ExternalCalendar | ReadonlyArray< ExternalCalendar >
): ReceiveExternalCalendarsAction {
	return {
		type: 'RECEIVE_EXTERNAL_CALENDARS',
		externalCalendars: castArray( externalCalendars ),
	};
} //end receiveExternalCalendars()

// ============
// HELPER TYPES
// ============

type ManageExternalCalendars = {
	readonly type: 'MANAGE_EXTERNAL_CALENDARS';
	readonly isActive: boolean;
};

type RemoveExternalCalendarAction = {
	readonly type: 'REMOVE_EXTERNAL_CALENDAR';
	readonly url: Url;
};

type OpenExternalCalendarEditorAction = {
	readonly type: 'OPEN_EXTERNAL_EDITOR_CALENDAR';
	readonly url: Url;
	readonly name: string;
};

type CloseExternalCalendarEditorAction = {
	readonly type: 'CLOSE_EXTERNAL_CALENDAR_EDITOR';
};

type SetEditingExternalCalendarUrlAction = {
	readonly type: 'SET_EDITING_EXTERNAL_CALENDAR_URL';
	readonly url: string;
};

type SetEditingExternalCalendarNameAction = {
	readonly type: 'SET_EDITING_EXTERNAL_CALENDAR_NAME';
	readonly name: string;
};

type MarkAsSavingAction = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};

type MarkAsDeletingAction = {
	readonly type: 'MARK_AS_DELETING';
	readonly url: Url;
	readonly isDeleting: boolean;
};

type ReceiveExternalCalendarsAction = {
	readonly type: 'RECEIVE_EXTERNAL_CALENDARS';
	readonly externalCalendars: ReadonlyArray< ExternalCalendar >;
};
