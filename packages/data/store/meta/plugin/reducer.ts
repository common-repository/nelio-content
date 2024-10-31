/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { PluginAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'INIT_PLUGIN_SETTINGS':
			return {
				...state,
				...action.settings,
			};

		case 'MARK_SOCIAL_PUBLICATION_STATUS_AS_PAUSED':
			return {
				...state,
				isSocialPublicationPaused: action.isPaused,
				isSocialPublicationStatusBeingSynched: false,
			};

		case 'MARK_SOCIAL_PUBLICATION_STATUS_AS_BEING_SYNCHED':
			return {
				...state,
				isSocialPublicationStatusBeingSynched: action.isBeingSynched,
			};

		case 'RECEIVE_AUTHENTICATION_TOKEN':
			return {
				...state,
				authenticationToken: action.token,
			};

		case 'SET_DEFAULT_TIME':
			return {
				...state,
				defaultTimes: {
					...state.defaultTimes,
					[ action.context ]: action.time,
				},
			};

		case 'OPEN_PREMIUM_DIALOG':
			return {
				...state,
				premiumDialog: action.feature,
			};

		case 'CLOSE_PREMIUM_DIALOG':
			return {
				...state,
				premiumDialog: 'none',
			};
	} //end switch
} //end actualReducer()
