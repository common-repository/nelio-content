/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { getValue, setValue } from '@nelio-content/utils';
import type {
	CalendarMode,
	CalendarPane,
	CalendarFilters,
	CalendarSettings,
} from '@nelio-content/calendar';

export function getPreviousSettings(): Partial< CalendarSettings > {
	let result: Partial< CalendarSettings > = {};

	const calendarMode = getValue< CalendarMode >( 'calendarMode' );
	if ( undefined !== calendarMode ) {
		result = { ...result, calendarMode };
	} //end if

	const sidePane = getValue< CalendarPane >( 'calendarSidePane' );
	if ( undefined !== sidePane ) {
		result = { ...result, sidePane };
	} //end if

	return result;
} //end getPreviousSettings()

export function getPreviousFilters(): Partial< CalendarFilters > {
	return getValue< Partial< CalendarFilters > >( 'calendarFilters' ) ?? {};
} //end getPreviousFilters()

export function listenToStoreChanges(): void {
	const getState = () => ( {
		calendarMode: select( NC_CALENDAR ).getCalendarMode(),
		sidePane: select( NC_CALENDAR ).getSidePane(),
		filters: select( NC_CALENDAR ).getFilters(),
	} );

	let prevState = getState();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const state = getState();

		if ( state.calendarMode !== prevState.calendarMode ) {
			setValue( 'calendarMode', state.calendarMode );
		} //end if

		if ( state.sidePane !== prevState.sidePane ) {
			setValue( 'calendarSidePane', state.sidePane );
		} //end if

		if ( state.filters !== prevState.filters ) {
			setValue( 'calendarFilters', state.filters );
		} //end if

		prevState = state;
	}, NC_CALENDAR );
} //end listenToStoreChanges()
