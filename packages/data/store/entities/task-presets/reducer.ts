/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { TaskPresetAction as Action } from '../actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( _: State, action: Action ): State {
	switch ( action.type ) {
		case 'RESET_TASK_PRESETS':
			return action.presets;
	} //end switch
} //end actualReducer()
