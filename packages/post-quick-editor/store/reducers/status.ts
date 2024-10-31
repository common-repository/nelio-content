/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { StatusAction as Action } from '../actions/status';

type State = FullState[ 'status' ];

export function status( state = INIT_STATE.status, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end status()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return {
				...INIT_STATE.status,
				isPublished:
					'status' in action.post && 'publish' === action.post.status,
				isVisible: true,
			};

		case 'CLOSE_EDITOR':
			return INIT_STATE.status;

		case 'SET_EXTRA_INFO_TAB':
			return {
				...state,
				extraInfoTab: action.tab,
			};

		case 'SET_VALIDATION_ERROR':
			return {
				...state,
				error: action.error,
			};

		case 'MARK_AS_SAVING':
			return {
				...state,
				isSaving: !! action.isSaving,
			};
	} //end switch
} //end actualReducer()
