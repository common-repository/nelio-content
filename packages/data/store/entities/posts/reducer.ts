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
import type { PostAction as Action } from '../actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_POSTS':
			return {
				...state,
				...keyBy( action.posts, 'id' ),
			};

		case 'REMOVE_POST':
			return omit( state, action.postId );
	} //end switch
} //end actualReducer()
