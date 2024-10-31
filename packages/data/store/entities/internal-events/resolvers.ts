/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import { range } from 'lodash';

import { dateI18n } from '@nelio-content/date';
import {
	addDays,
	diffDays,
	getValue,
	logError,
	setValue,
} from '@nelio-content/utils';
import type { InternalEvent } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getInternalEvents(): Promise< void > {
	const cacheKey = 'internal-events';
	const cachedEvents =
		getValue< ReadonlyArray< InternalEvent > >( cacheKey ) ?? [];
	await dispatch( NC_DATA ).receiveInternalEvents( cachedEvents );

	try {
		const result = await apiFetch< ReadonlyArray< InternalEvent > >( {
			path: '/nelio-content/v1/internal-events',
		} );

		const events = [ ...result ]
			.map( ( e ) => fixInternalEvent( e ) )
			.reduce( ( r, es ) => [ ...r, ...es ], [] );

		setValue( cacheKey, events, 7 * 24 * 60 * 60 );

		await dispatch( NC_DATA ).receiveInternalEvents( events );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getInternalEvents()

// =======
// HELPERS
// =======

function fixInternalEvent(
	event: InternalEvent
): ReadonlyArray< InternalEvent > {
	const start = dateI18n( 'Y-m-d', event.start || event.date );
	const end = dateI18n(
		'Y-m-d',
		event.end === 'future'
			? new Date().toISOString()
			: event.end || event.date
	);

	if ( start === end ) {
		return [
			{
				id: event.id || uuid(),
				date: new Date( event.date ).toISOString() ?? '',
				title: event.title ?? '',
				description: event.description ?? '',
				isDayEvent: !! event.isDayEvent,
				type: event.type ?? '',
				...( !! event.color && { color: event.color } ),
				...( !! event.backgroundColor && {
					backgroundColor: event.backgroundColor,
				} ),
				...( !! event.editLink && { editLink: event.editLink } ),
			},
		];
	} //end if

	const days = Math.max( 1, Math.abs( diffDays( end, start ) ) );
	const events = range( days + 1 ).map( ( offset ) => ( {
		id: uuid(),
		date: addDays( start, offset ),
		title: event.title ?? '',
		description: event.description ?? '',
		isDayEvent: true,
		type: event.type ?? '',
		...( !! event.color && { color: event.color } ),
		...( !! event.backgroundColor && {
			backgroundColor: event.backgroundColor,
		} ),
		...( !! event.editLink && { editLink: event.editLink } ),
	} ) );

	return events.map( ( e, pos ) => {
		if ( pos === 0 ) {
			return {
				...e,
				isDayEvent: false,
				date: new Date( event.start || event.date ).toISOString(),
			};
		} else if ( pos === events.length - 1 && event.end !== 'future' ) {
			return {
				...e,
				isDayEvent: false,
				date: new Date( event.end || event.date ).toISOString(),
			};
		} //end if
		return e;
	} );
} //end fixInternalEvent()
