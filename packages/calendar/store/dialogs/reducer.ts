/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './config';
import type { CustomDialogsAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EXPORT_DIALOG':
			return {
				...state,
				isExportDialogOpen: action.isOpen,
			};

		case 'OPEN_TASK_VIEWER_DIALOG':
			return {
				...state,
				taskIdInTaskViewer: action.taskId,
			};

		case 'REQUEST_RECURRING_RESCHEDULE_MODE':
			return {
				...state,
				recurringAction: {
					type: 'reschedule',
					props: action.props,
				},
			};

		case 'REQUEST_RECURRING_TRASH_MODE':
			return {
				...state,
				recurringAction: {
					type: 'trash',
					props: action.props,
				},
			};

		case 'CLOSE_RECURRING_DIALOG':
			return {
				...state,
				recurringAction: undefined,
			};
	} //end switch
} //end actualReducer()
