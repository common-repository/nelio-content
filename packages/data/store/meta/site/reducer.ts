/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { SiteAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'INIT_SITE_SETTINGS':
			return {
				...state,
				...action.settings,
			};

		case 'SET_UTC_NOW':
			return {
				...state,
				now: action.now,
			};
	} //end switch
} //end actualReducer()
