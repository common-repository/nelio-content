/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { ExternalEvent, Url, Uuid } from '@nelio-content/types';

export type ExternalEventAction =
	| ReceiveExternalEventsAction
	| RemoveExternalEventsAction;

export function receiveExternalEvents(
	calendar: Url,
	events: ExternalEvent | ReadonlyArray< ExternalEvent >
): ReceiveExternalEventsAction {
	return {
		type: 'RECEIVE_EXTERNAL_EVENTS',
		calendar,
		events: castArray( events ),
	};
} //end receiveExternalEvents()

export function removeExternalEvents(
	ids: Uuid | ReadonlyArray< Uuid >
): RemoveExternalEventsAction {
	return {
		type: 'REMOVE_EXTERNAL_EVENTS',
		ids: castArray( ids ),
	};
} //end removeExternalEvents()

// ============
// HELPER TYPES
// ============

type ReceiveExternalEventsAction = {
	readonly type: 'RECEIVE_EXTERNAL_EVENTS';
	readonly calendar: Url;
	readonly events: ReadonlyArray< ExternalEvent >;
};

type RemoveExternalEventsAction = {
	readonly type: 'REMOVE_EXTERNAL_EVENTS';
	readonly ids: ReadonlyArray< Uuid >;
};
