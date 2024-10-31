/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { InternalEvent } from '@nelio-content/types';

export type InternalEventAction = ReceiveInternalEventsAction;

export function receiveInternalEvents(
	events: InternalEvent | ReadonlyArray< InternalEvent >
): ReceiveInternalEventsAction {
	return {
		type: 'RECEIVE_INTERNAL_EVENTS',
		events: castArray( events ),
	};
} //end receiveInternalEvents()

// ============
// HELPER TYPES
// ============

type ReceiveInternalEventsAction = {
	readonly type: 'RECEIVE_INTERNAL_EVENTS';
	readonly events: ReadonlyArray< InternalEvent >;
};
