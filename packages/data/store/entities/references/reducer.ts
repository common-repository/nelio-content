/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { ReferenceAction as Action } from '../actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_SUGGESTED_REFERENCES':
			return {
				...state,
				[ action.postId ]: action.references,
			};
	} //end switch
} //end actualReducer()
