/**
 * External dependencies
 */
import type { Maybe, Url } from '@nelio-content/types';

export type State = CalendarSettings & {
	readonly adminSidebarWidth: number;
	readonly calendarWidth: number;
	readonly minRowHeight: number;
};

export const INIT_STATE: State = {
	adminSidebarWidth: 0,
	calendarMode: 'two-weeks',
	calendarWidth: 0,
	focusDay: '',
	icsLinks: undefined,
	minRowHeight: 0,
	numberOfNonCollapsableMessages: 0,
	sidePane: 'unscheduled-posts',
	useEditorialCalendarOnly: false,
	calendarTimeFormat: 'H:ia',
	simplifyCalendarTime: true,
};

// ============
// HELPER TYPES
// ============

export type CalendarPane =
	| 'none'
	| 'filters'
	| 'reusable-messages'
	| 'unscheduled-posts'
	| 'errors';

export type CalendarMode = 'agenda' | 'week' | 'two-weeks' | 'month';

export type CalendarSettings = {
	readonly calendarMode: CalendarMode;
	readonly calendarTimeFormat: string;
	readonly focusDay: string;
	readonly icsLinks: Maybe< {
		readonly all: Url;
		readonly user: Url;
	} >;
	readonly numberOfNonCollapsableMessages: number;
	readonly sidePane: CalendarPane;
	readonly simplifyCalendarTime: boolean;
	readonly useEditorialCalendarOnly: boolean;
};
