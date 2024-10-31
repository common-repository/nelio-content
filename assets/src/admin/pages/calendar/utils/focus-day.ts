/**
 * WordPress dependencies
 */
import { select, dispatch, subscribe } from '@safe-wordpress/data';
import {
	addQueryArgs,
	getQueryArg,
	removeQueryArgs,
} from '@safe-wordpress/url';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import type { CalendarMode } from '@nelio-content/calendar';

export function trackFocusDay(): void {
	const dayInUrl = getFocusDayFromUrl();
	if ( dayInUrl ) {
		void dispatch( NC_CALENDAR ).setFocusDay( dayInUrl );
	} //end if

	const { getSettings } = select( NC_CALENDAR );
	let prevSettings = getSettings();
	fixFocusDayInUrl( prevSettings.calendarMode, prevSettings.focusDay );

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const settings = getSettings();
		if (
			settings.calendarMode === prevSettings.calendarMode &&
			settings.focusDay === prevSettings.focusDay
		) {
			return;
		} //end if

		prevSettings = settings;
		fixFocusDayInUrl( settings.calendarMode, settings.focusDay );
	}, NC_CALENDAR );
} //end trackFocusDay()

function getFocusDayFromUrl(): string {
	const url = document.location.href;
	const day = getQueryArg( url, 'day' );
	if (
		'string' === typeof day &&
		/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test( day )
	) {
		return day;
	} //end if

	const date = getQueryArg( url, 'date' );
	if ( 'string' === typeof date && /^[0-9]{4}-[0-9]{2}$/.test( date ) ) {
		return `${ date }-01`;
	} //end if

	return '';
} //end getFocusDayFromUrl()

function fixFocusDayInUrl( mode: CalendarMode, day: string ) {
	const href = removeQueryArgs( document.location.href, 'date', 'day' );
	const url =
		'month' === mode
			? addQueryArgs( href, { date: day.substring( 0, 7 ) } )
			: addQueryArgs( href, { day } );
	window.history.replaceState( null, '', url );
} //end fixFocusDayInUrl()
