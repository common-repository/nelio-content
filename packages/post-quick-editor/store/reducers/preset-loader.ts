/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { TaskPresetAction as Action } from '../actions/preset-loader';

type State = FullState[ 'presetLoader' ];

export function presetLoader(
	state = INIT_STATE.presetLoader,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end presetLoader()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_TASK_PRESET_LOADER':
			return {
				...INIT_STATE.presetLoader,
				isOpen: action.isOpen,
			};

		case 'SELECT_TASK_PRESETS':
			return state.isOpen
				? { ...state, selection: action.selection }
				: state;
	} //end switch
} //end actualReducer()
