/**
 * External dependencies
 */
import { keyBy, omit, values } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { ExternalEventAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_EXTERNAL_EVENTS':
			return keyBy(
				[
					...values( state ).filter(
						( ev ) => ev.calendar !== action.calendar
					),
					...action.events,
				],
				'id'
			);

		case 'REMOVE_EXTERNAL_EVENTS':
			return omit( state, action.ids );
	} //end switch
} //end actualReducer()
