/**
 * Internal dependencies
 */
import type { CalendarMode, CalendarPane, CalendarSettings } from './config';

export type SettingsAction =
	| InitCalendarSettingsAction
	| ToggleSidePane
	| SetCalendarModeAction
	| SetFocusDayAction
	| SetCalendarDimensionsAction;

export function initCalendarSettings(
	settings: Partial< CalendarSettings >
): InitCalendarSettingsAction {
	return {
		type: 'INIT_CALENDAR_SETTINGS',
		settings,
	};
} //end initCalendar()

export function toggleSidePane(
	pane: Exclude< CalendarPane, 'none' >
): ToggleSidePane {
	return {
		type: 'TOGGLE_SIDE_PANE',
		pane,
	};
} //end toggleSidePane()

export function _setCalendarMode( mode: CalendarMode ): SetCalendarModeAction {
	return {
		type: 'SET_CALENDAR_MODE',
		mode,
	};
} //end _setCalendarMode()

export function setFocusDay( localFocusDay: string ): SetFocusDayAction {
	return {
		type: 'SET_FOCUS_DAY',
		focusDay: localFocusDay,
	};
} //end setFocusDay()

export function setCalendarDimensions( {
	adminSidebarWidth,
	calendarWidth,
	minRowHeight,
}: {
	readonly adminSidebarWidth: number;
	readonly calendarWidth: number;
	readonly minRowHeight: number;
} ): SetCalendarDimensionsAction {
	return {
		type: 'SET_CALENDAR_DIMENSIONS',
		adminSidebarWidth,
		calendarWidth,
		minRowHeight,
	};
} //end setCalendarDimensions()

// ============
// HELPER TYPES
// ============

export type InitCalendarSettingsAction = {
	readonly type: 'INIT_CALENDAR_SETTINGS';
	readonly settings: Partial< CalendarSettings >;
};

type ToggleSidePane = {
	readonly type: 'TOGGLE_SIDE_PANE';
	readonly pane: Exclude< CalendarPane, 'none' >;
};

type SetCalendarModeAction = {
	readonly type: 'SET_CALENDAR_MODE';
	readonly mode: CalendarMode;
};

type SetFocusDayAction = {
	readonly type: 'SET_FOCUS_DAY';
	readonly focusDay: string;
};

type SetCalendarDimensionsAction = {
	readonly type: 'SET_CALENDAR_DIMENSIONS';
	readonly adminSidebarWidth: number;
	readonly calendarWidth: number;
	readonly minRowHeight: number;
};
