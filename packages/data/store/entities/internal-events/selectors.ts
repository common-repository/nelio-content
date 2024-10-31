/**
 * External dependencies
 */
import { values } from 'lodash';
import type { InternalEvent, Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getInternalEvent(
	state: State,
	id?: Uuid
): Maybe< InternalEvent > {
	return id ? state.entities.internalEvents[ id ] : undefined;
} //end getInternalEvent()

export function getInternalEvents(
	state: State
): ReadonlyArray< InternalEvent > {
	return values( state.entities.internalEvents );
} //end getInternalEvents()
