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
import type { AuthorAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_AUTHORS':
			return {
				...state,
				...keyBy( action.authors, 'id' ),
			};
	} //end switch
} //end actualReducer()
