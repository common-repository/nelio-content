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
import type { ProfileListAction as Action } from '../actions/profile-list';

type State = FullState[ 'profileList' ];

export function profileList(
	state = INIT_STATE.profileList,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end profileList()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_AS_BEING_DELETED':
			return {
				...state,
				deleting: [ ...state.deleting, action.profileId ],
			};

		case 'MARK_AS_DELETED':
			return {
				...state,
				deleting: without( state.deleting, action.profileId ),
			};

		case 'MARK_AS_REFRESHING_PROFILES':
			return {
				...state,
				isRefreshing: action.isRefreshing,
			};
	} //end switch
} //end actualReducer()
