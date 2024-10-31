/**
 * External dependencies
 */
import { omit } from 'lodash';
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
				context: action.options.context,
				isNewTask: action.isNewTask,
				isVisible: true,
				relatedPost: {
					post: action.options.post,
					status: action.options.post ? 'ready' : 'none',
				},
				source: action.task,
				onSave: action.options.onSave,
			};

		case 'CLOSE_EDITOR':
			return INIT_STATE.status;

		case 'SET_POST': {
			if ( ! action.post ) {
				return {
					...state,
					relatedPost: omit( state.relatedPost, 'post' ),
				};
			} //end if

			return {
				...state,
				relatedPost: {
					...state.relatedPost,
					post: action.post,
				},
			};
		}

		case 'SET_RELATED_POST_STATUS':
			return {
				...state,
				relatedPost: {
					...state.relatedPost,
					status: action.status,
				},
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
