/**
 * External dependencies
 */
import type { ExternalCalendar, Maybe, Url } from '@nelio-content/types';

export type State = {
	readonly externalCalendars: Record< Url, ExternalCalendar >;

	readonly addExternalCalendarForm: {
		readonly url: string;
		readonly isAddingExternalCalendar: boolean;
	};

	readonly externalCalendarEditor: Maybe< {
		readonly isSaving: boolean;
		readonly name: string;
		readonly url: Url;
	} >;

	readonly externalCalendarsBeingDeleted: ReadonlyArray< Url >;
};
