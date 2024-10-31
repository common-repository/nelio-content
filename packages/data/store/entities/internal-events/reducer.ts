/**
 * External dependencies
 */
import { keyBy } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { InternalEventAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( _: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_INTERNAL_EVENTS':
			return keyBy( action.events, 'id' );
	} //end switch
} //end actualReducer()
