/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import ICALExpander from 'ical-expander';
import { v4 as uuid } from 'uuid';
import { range, trim } from 'lodash';
import type { IcalEvent } from 'ical-expander';

import {
	addDays,
	diffDays,
	getValue,
	logError,
	setValue,
} from '@nelio-content/utils';
import type { ExternalEvent, Url, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getExternalEvents( calendarUrl: Url ): Promise< void > {
	const cacheKey = `external-events-${ calendarUrl }`;
	const cachedEvents =
		getValue< ReadonlyArray< ExternalEvent > >( cacheKey ) ?? [];
	await dispatch( NC_DATA ).receiveExternalEvents(
		calendarUrl,
		cachedEvents
	);

	try {
		const today = select( NC_DATA ).getToday();
		const from = addDays( today, -50 );
		const to = addDays( today, 500 );
		const data = await apiFetch< string >( {
			path: addQueryArgs( '/nelio-content/v1/external-calendar/events', {
				url: calendarUrl,
			} ),
		} );
		const icalExpander = new ICALExpander( {
			ics: data,
			maxIterations: 1000,
		} );
		const result = icalExpander.between( new Date( from ), new Date( to ) );
		const events = [ ...result.events, ...result.occurrences ]
			.map( icalEventToJson( calendarUrl ) )
			.map( fixEventDates )
			.reduce( ( r, es ) => [ ...r, ...es ], [] );

		setValue( cacheKey, events, 7 * 24 * 60 * 60 );

		await dispatch( NC_DATA ).receiveExternalEvents( calendarUrl, events );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getExternalEvents()

// =======
// HELPERS
// =======

type JsonEvent = {
	readonly id: Uuid;
	readonly start: string;
	readonly end: string;
	readonly title: string;
	readonly description: string;
	readonly calendar: Url;
};

function icalEventToJson( calendar: Url ): ( event: IcalEvent ) => JsonEvent {
	return ( event ) => ( {
		id: uuid(),
		start: trim( event.startDate ),
		end: trim( event.endDate ),
		title: trim( event.summary || event.item?.summary ),
		description: trim( event.description || event.item?.description ),
		calendar,
	} );
} //end icalEventToJson()

function fixEventDates( event: JsonEvent ): ReadonlyArray< ExternalEvent > {
	if ( event.start.includes( 'T' ) ) {
		return [
			updateEvent( event, {
				date: new Date( event.start ).toISOString(),
				isDayEvent: false,
			} ),
		];
	} //end if

	const start = event.start.substring( 0, 10 );
	const end = event.end.substring( 0, 10 );
	const days = Math.max( 1, Math.abs( diffDays( end, start ) ) );
	return range( days ).map( ( offset ) =>
		updateEvent( event, {
			id: uuid(),
			date: addDays( start, offset ),
			isDayEvent: true,
		} )
	);
} //end fixEventDates()

function updateEvent(
	event: Partial< Omit< ExternalEvent, 'id' | 'calendar' > > &
		Pick< ExternalEvent, 'id' | 'calendar' >,
	attrs: Partial< ExternalEvent > = {}
): ExternalEvent {
	return {
		id: event.id,
		calendar: event.calendar,
		date: event.date ?? '',
		isDayEvent: !! event.isDayEvent,
		title: event.title ?? '',
		description: event.description ?? '',
		...attrs,
	};
} //end updateEvent()
