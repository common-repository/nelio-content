/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ConnectionAction as Action } from '../actions/connection';

type State = FullState[ 'connection' ];

export function connection(
	state = INIT_STATE.connection,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end connection()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_KIND_DIALOG_FOR_NETWORK':
			return {
				...state,
				kindDialog: action.network,
			};

		case 'CLOSE_KIND_DIALOG':
			return {
				...state,
				kindDialog: undefined,
			};

		case 'OPEN_CONNECTION_DIALOG':
			return {
				...state,
				connectionDialog: action.dialog,
			};

		case 'CLOSE_CONNECTION_DIALOG':
			return {
				...state,
				connectionDialog: undefined,
			};
	} //end switch
} //end actualReducer()
