/**
 * WordPress dependencies
 */
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import moment from 'moment';
import { store as NC_DATA } from '@nelio-content/data';
import { date, wpifyDateTime } from '@nelio-content/date';
import { showErrorNotice } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../store';
import type { CalendarMode } from './config';

export async function showToday( delay = 500 ): Promise< void > {
	const today = select( NC_DATA ).getToday();
	await dispatch( NC_CALENDAR ).setFocusDay( today );
	try {
		await dispatch( NC_CALENDAR ).loadItemsIn( delay );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end showToday()

export async function nextPeriod( delay = 500 ): Promise< void > {
	const calendarMode = select( NC_CALENDAR ).getCalendarMode();
	const focusDay = select( NC_CALENDAR ).getFocusDay();
	const focusMoment = moment( wpifyDateTime( 'c', focusDay, '12:00' ) );

	const nextMoment = focusMoment.clone();
	if ( 'month' === calendarMode ) {
		nextMoment.date( 1 ).add( 1, 'month' );
	} else {
		const numberOfDays = select( NC_CALENDAR ).getNumberOfVisibleDays();
		nextMoment.add( numberOfDays, 'days' );
	} //end if

	await dispatch( NC_CALENDAR ).setFocusDay( date( 'Y-m-d', nextMoment ) );
	try {
		await dispatch( NC_CALENDAR ).loadItemsIn( delay );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end nextPeriod()

export async function previousPeriod( delay = 500 ): Promise< void > {
	const calendarMode = select( NC_CALENDAR ).getCalendarMode();
	const focusDay = select( NC_CALENDAR ).getFocusDay();
	const focusMoment = moment( wpifyDateTime( 'c', focusDay, '12:00' ) );

	const previousMoment = focusMoment.clone();
	if ( 'month' === calendarMode ) {
		previousMoment.date( 1 ).subtract( 1, 'month' );
	} else {
		const numberOfDays = select( NC_CALENDAR ).getNumberOfVisibleDays();
		previousMoment.subtract( numberOfDays, 'days' );
	} //end if

	await dispatch( NC_CALENDAR ).setFocusDay(
		date( 'Y-m-d', previousMoment )
	);
	try {
		await dispatch( NC_CALENDAR ).loadItemsIn( delay );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end previousPeriod()

export async function setCalendarMode(
	mode: CalendarMode,
	delay = 500
): Promise< void > {
	await dispatch( NC_CALENDAR )._setCalendarMode( mode );
	try {
		await dispatch( NC_CALENDAR ).loadItemsIn( delay );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end setCalendarMode()
