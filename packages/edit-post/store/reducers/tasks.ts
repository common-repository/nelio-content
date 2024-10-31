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
import type { TasksAction } from '../actions/tasks';
import type { MarkAsLoadingPostItems } from '../actions/post';

type Action = TasksAction | MarkAsLoadingPostItems;
type State = FullState[ 'tasks' ];

export function tasks( state = INIT_STATE.tasks, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end tasks()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_EDITORIAL_TASK_AS_SYNCHING':
			return {
				...state,
				synching: action.isSynching
					? [ ...state.synching, action.taskId ]
					: without( state.synching, action.taskId ),
			};

		case 'MARK_EDITORIAL_TASK_AS_DELETING':
			return {
				...state,
				deleting: action.isDeleting
					? [ ...state.deleting, action.taskId ]
					: without( state.deleting, action.taskId ),
			};

		case 'MARK_AS_LOADING_POST_ITEMS':
			return {
				...state,
				isRetrievingTasks: action.isLoading,
			};

		case 'OPEN_TASK_PRESET_LOADER':
			return {
				...state,
				preset: action.isOpen
					? {
							selection: [],
							state: 'selection',
					  }
					: undefined,
			};

		case 'SELECT_TASK_PRESETS':
			return {
				...state,
				preset: state.preset
					? {
							...state.preset,
							selection: action.selection,
					  }
					: undefined,
			};

		case 'SET_TASK_PRESETS_STATE':
			return {
				...state,
				preset: state.preset
					? {
							...state.preset,
							state: action.state,
					  }
					: undefined,
			};
	} //end switch
} //end actualReducer()
