/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';

export function makeGridResizable(): void {
	listenToSidebar();
	listenToWindowResize();
	listenToCalendarModeChange();
	fixCalendar();
	setTimeout( fixCalendar, 0 );
} //end makeGridResizable()

// =======
// HELPERS
// =======

function listenToSidebar() {
	const collapseButton = document.getElementById( 'collapse-button' );
	if ( ! collapseButton ) {
		return;
	} //end if

	collapseButton.addEventListener( 'click', debounce( fixCalendar, 50 ) );
	collapseButton.addEventListener( 'click', debounce( fixCalendar, 250 ) );
} //end listenToSidebar()

function listenToWindowResize() {
	window.addEventListener( 'resize', debounce( fixCalendar, 250 ) );
} //end listenToWindowResize()

function listenToCalendarModeChange() {
	let prevCalendarMode = select( NC_CALENDAR ).getCalendarMode();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const calendarMode = select( NC_CALENDAR ).getCalendarMode();
		if ( calendarMode === prevCalendarMode ) {
			return;
		} //end if
		prevCalendarMode = calendarMode;
		fixCalendar();
	}, NC_CALENDAR );
} //end listenToCalendarModeChange()

function fixCalendar(): void {
	const grid: HTMLElement | null = document.querySelector(
		'.nelio-content-calendar__grid'
	);
	if ( ! grid ) {
		return;
	} //end if

	grid.style.display = 'none';
	const height = getBodyHeight();
	grid.removeAttribute( 'style' );

	const topbar: HTMLElement | null = document.getElementById( 'wpadminbar' );
	const header: HTMLElement | null = document.querySelector(
		'.nelio-content-calendar__header'
	);
	const weekdays: HTMLElement | null = document.querySelector(
		'.nelio-content-grid__header'
	);
	const gridRowHeight =
		height -
		getHeight( topbar ) -
		getHeight( header ) -
		getHeight( weekdays );

	const calendarMode = select( NC_CALENDAR ).getCalendarMode();
	const { setCalendarDimensions } = dispatch( NC_CALENDAR );
	switch ( calendarMode ) {
		case 'agenda':
			return void setCalendarDimensions( {
				adminSidebarWidth: getAdminSidebarWidth(),
				calendarWidth: getCalendarWidth(),
				minRowHeight: gridRowHeight / 6 - 1,
			} );
		case 'month':
			return void setCalendarDimensions( {
				adminSidebarWidth: getAdminSidebarWidth(),
				calendarWidth: getCalendarWidth(),
				minRowHeight: gridRowHeight / 6 - 1,
			} );

		case 'two-weeks':
			return void setCalendarDimensions( {
				adminSidebarWidth: getAdminSidebarWidth(),
				calendarWidth: getCalendarWidth(),
				minRowHeight: gridRowHeight / 2 - 1,
			} );

		default:
			return void setCalendarDimensions( {
				adminSidebarWidth: getAdminSidebarWidth(),
				calendarWidth: getCalendarWidth(),
				minRowHeight: gridRowHeight - 1,
			} );
	} //end switch
} //end fixCalendar()

function getAdminSidebarWidth() {
	const sidebar = document.getElementById( 'adminmenu' );
	if ( ! sidebar ) {
		return 0;
	} //end if
	return Math.round( sidebar.getBoundingClientRect().width );
} //end getAdminSidebarWidth()

function getCalendarWidth() {
	const calendar = document.getElementById( 'nelio-content-page' );
	if ( ! calendar ) {
		return 0;
	} //end if
	return Math.round( calendar.getBoundingClientRect().width );
} //end getCalendarWidth()

function getBodyHeight() {
	const body = document.body;
	const html = document.documentElement;
	return Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	);
} //end getBodyHeight()

function getHeight( el: HTMLElement | null ) {
	if ( ! el ) {
		return 0;
	} //end if
	return el.getBoundingClientRect().height;
} //end getHeight()
