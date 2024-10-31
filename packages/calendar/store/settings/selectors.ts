/**
 * External dependencies
 */
import moment from 'moment';
import { date, dateI18n, wpifyDateTime } from '@nelio-content/date';
import type { Moment } from 'moment';
import type { Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { CalendarMode, CalendarPane } from './config';
import type { State } from '../config';

export function getSettings( state: State ): State[ 'settings' ] {
	return state.settings;
} //end getSettings()

export function isUnscheduledViewOpen( state: State ): boolean {
	return 'unscheduled-posts' === state.settings.sidePane;
} //end isUnscheduledViewOpen()

export function isReusableMessageViewOpen( state: State ): boolean {
	return 'reusable-messages' === state.settings.sidePane;
} //end isReusableMessageViewOpen()

export function isFilterPaneOpen( state: State ): boolean {
	return 'filters' === state.settings.sidePane;
} //end isFilterPaneOpen()

export function isErrorPaneOpen( state: State ): boolean {
	return 'errors' === state.settings.sidePane;
} //end isErrorPaneOpen()

export function useEditorialCalendarOnly( state: State ): boolean {
	return state.settings.useEditorialCalendarOnly;
} //end useEditorialCalendarOnly()

export function formatCalendarTime(
	state: State,
	datetime: Date | string | Moment
): string {
	const time = dateI18n( state.settings.calendarTimeFormat, datetime );
	return state.settings.simplifyCalendarTime
		? time.replace( ':00', '' ).replace( /m$/i, '' ).replace( /\s/g, '' )
		: time;
} //end formatCalendarTime()

export function isIcsEnabled( state: State ): boolean {
	return !! state.settings.icsLinks;
} //end isIcsEnabled()

export function getIcsLink( state: State, mode: 'user' | 'all' ): Maybe< Url > {
	return state.settings.icsLinks?.[ mode ];
} //end getIcsLink()

export function getSidePane( state: State ): CalendarPane {
	return state.settings.sidePane;
} //end getSidePane()

export function getCalendarMode( state: State ): CalendarMode {
	return state.settings.calendarMode;
} //end getCalendarMode()

export function getFocusDay( state: State ): string {
	return state.settings.focusDay;
} //end getFocusDay()

export function getFirstDay( state: State, firstDayOfWeek: number ): string {
	const focusDay = getFocusDay( state );
	const calendarMode = getCalendarMode( state );
	if ( 'agenda' === calendarMode ) {
		return focusDay;
	} //end if

	const focusMoment = moment( wpifyDateTime( 'c', focusDay, '12:00' ) );
	if ( 'month' === calendarMode ) {
		focusMoment.date( 1 );
	} //end if

	if ( focusMoment.day() === firstDayOfWeek ) {
		return date( 'Y-m-d', focusMoment );
	} //end if

	return date( 'Y-m-d', focusMoment.isoWeekday( firstDayOfWeek ) );
} //end getFirstDay()

export function getLastDay( state: State, firstDayOfWeek: number ): string {
	const firstDay = getFirstDay( state, firstDayOfWeek );
	if ( ! firstDay ) {
		return '';
	} //end if

	const days = getNumberOfVisibleDays( state );
	return date( 'Y-m-d', moment( firstDay ).add( days, 'days' ) );
} //end getLastDay()

export function getNumberOfVisibleDays( state: State ): number {
	switch ( getCalendarMode( state ) ) {
		case 'agenda':
			return 4;

		case 'week':
			return 7;

		case 'month':
			return 42;

		case 'two-weeks':
		default:
			return 14;
	} //end switch
} //end getNumberOfVisibleDays()

export function getNumberOfNonCollapsableMessages( state: State ): number {
	return state.settings.numberOfNonCollapsableMessages;
} //end getNumberOfNonCollapsableMessages()

export function getMinimumRowHeight( state: State ): number {
	return state.settings.minRowHeight;
} //end getMinimumRowHeight()

export function getCalendarWidth( state: State ): number {
	return state.settings.calendarWidth;
} //end getCalendarWidth()

export function getAdminSidebarWidth( state: State ): number {
	return state.settings.adminSidebarWidth;
} //end getAdminSidebarWidth()
