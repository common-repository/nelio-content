/**
 * External dependencies
 */
import { without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { TargetSelectorAction as Action } from '../actions/target-selector';

type State = FullState[ 'targetSelector' ];

export function targetSelector(
	state = INIT_STATE.targetSelector,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end targetSelector()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_TARGET_SELECTOR':
			return {
				...INIT_STATE.targetSelector,
				profileId: action.profileId,
				selectedTargetNames: action.selectedTargetNames,
			};

		case 'CLOSE_TARGET_SELECTOR':
			return INIT_STATE.targetSelector;

		case 'SELECT_TARGET_IN_TARGET_SELECTOR':
			return {
				...state,
				selectedTargetNames: action.isSelected
					? [ ...state.selectedTargetNames, action.targetName ]
					: without( state.selectedTargetNames, action.targetName ),
			};
	} //end switch
} //end actualReducer()
