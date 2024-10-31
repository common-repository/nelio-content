/**
 * External dependencies
 */
import { values } from 'lodash';
import type { ExternalEvent, Maybe, Url, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getExternalEvent(
	state: State,
	id?: Uuid
): Maybe< ExternalEvent > {
	return id ? state.entities.externalEvents[ id ] : undefined;
} //end getExternalEvent()

export function getExternalEvents(
	state: State,
	calendarId?: Url
): ReadonlyArray< ExternalEvent > {
	const events = values( state.entities.externalEvents );
	return events.filter( ( ev ) => ev.calendar === calendarId );
} //end getExternalEvents()
