/**
 * External dependencies
 */
import { values } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import type { ExternalCalendar, Maybe, Url } from '@nelio-content/types';

/**
 * External dependencies
 */
import type { State } from '../config';

export function isManagingExternalCalendars( state: State ): boolean {
	return state.externalCalendars.isManaging;
} //end isManagingExternalCalendars()

export function getExternalCalendarEditorMode(
	state: State
): 'none' | 'edit' | 'create' {
	if ( ! state.externalCalendars.editor ) {
		return 'none';
	} //end if
	return state.externalCalendars.editor.isNew ? 'create' : 'edit';
} //end getExternalCalendarEditorMode()

export function getExternalCalendars(
	state: State
): ReadonlyArray< ExternalCalendar > {
	return values( state.externalCalendars.byUrl );
} //end getExternalCalendars()

export function getExternalCalendar(
	state: State,
	url: Url
): Maybe< ExternalCalendar > {
	return state.externalCalendars.byUrl[ url ];
} //end getExternalCalendar()

export function getEditingExternalCalendarUrl( state: State ): string {
	const { editor } = state.externalCalendars;
	return editor?.url ?? '';
} //end getEditingExternalCalendarUrl()

export function getEditingExternalCalendarName( state: State ): string {
	const { editor } = state.externalCalendars;
	return editor?.name ?? '';
} //end getEditingExternalCalendarName()

export function isAddingAnExternalCalendar( state: State ): boolean {
	const { editor } = state.externalCalendars;
	return !! editor?.isNew && !! editor?.isSaving;
} //end isAddingAnExternalCalendar()

export function isSavingAnExternalCalendar( state: State ): boolean {
	const { editor } = state.externalCalendars;
	return !! editor?.isSaving;
} //end isSavingAnExternalCalendar()

export function isDeletingAnExternalCalendar( state: State ): boolean {
	return ! isEmpty( state.externalCalendars.deleting );
} //end isDeletingAnExternalCalendar()

export function isDeletingExternalCalendar( state: State, url: Url ): boolean {
	return state.externalCalendars.deleting.includes( url );
} //end isDeletingExternalCalendar()
