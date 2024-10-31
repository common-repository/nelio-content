/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { ReusableMessageAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_REUSABLE_MESSAGES':
			return {
				...state,
				byId: {
					...state.byId,
					...keyBy( action.messages, 'id' ),
				},
			};

		case 'REMOVE_REUSABLE_MESSAGE':
			return {
				...state,
				byId: omit( state.byId, action.messageId ),
			};

		case 'MARK_REUSABLE_MESSAGES_AS_FULLY_LOADED':
			return {
				...state,
				loader: {
					...state.loader,
					queryStatus: {},
					isFullyLoaded: true,
				},
			};

		case 'SET_REUSABLE_MESSAGE_QUERY':
			return {
				...state,
				loader: {
					...state.loader,
					query: action.query,
				},
			};

		case 'SET_REUSABLE_MESSAGE_QUERY_STATUS':
			if ( state.loader.isFullyLoaded ) {
				return state;
			} //end if

			return {
				...state,
				loader: {
					...state.loader,
					queryStatus: {
						...state.loader.queryStatus,
						[ action.query ]: action.status,
					},
				},
			};
	} //end switch
} //end actualReducer()
