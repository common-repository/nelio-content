/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './config';
import type { DragAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'DRAG_START':
			return {
				...state,
				drag: action.item,
				hover: undefined,
			};

		case 'DRAG_END':
			return {
				...state,
				drag: undefined,
			};

		case 'HOVER_ITEM':
			return {
				...state,
				hover: action.item,
			};

		case 'HOVER_END':
			return {
				...state,
				hover: undefined,
			};
	} //end switch
} //end actualReducer()
