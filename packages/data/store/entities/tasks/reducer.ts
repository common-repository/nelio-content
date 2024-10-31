/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import { createItemSummary } from '@nelio-content/utils';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import { groupByRelatedPost, removeFromRelatedPost } from '../helpers';
import type { State } from './config';
import type { TaskAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_TASKS':
			return {
				byId: {
					...state.byId,
					...keyBy( action.tasks, 'id' ),
				},
				byRelatedPost: groupByRelatedPost(
					state.byRelatedPost,
					action.tasks.map( ( c ) => createItemSummary( 'task', c ) )
				),
			};

		case 'REMOVE_TASK':
			return {
				byId: omit( state.byId, action.taskId ),
				byRelatedPost: removeFromRelatedPost(
					state.byRelatedPost,
					action.taskId
				),
			};
	} //end switch
} //end actualReducer()
