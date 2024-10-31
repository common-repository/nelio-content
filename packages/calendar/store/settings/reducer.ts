/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './config';
import type { SettingsAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_CALENDAR_DIMENSIONS':
			return {
				...state,
				adminSidebarWidth: action.adminSidebarWidth,
				calendarWidth: action.calendarWidth,
				minRowHeight: action.minRowHeight,
			};

		case 'TOGGLE_SIDE_PANE':
			return {
				...state,
				sidePane: state.sidePane === action.pane ? 'none' : action.pane,
			};

		case 'SET_CALENDAR_MODE':
			return {
				...state,
				calendarMode: action.mode || 'two-weeks',
			};

		case 'SET_FOCUS_DAY':
			return {
				...state,
				focusDay: action.focusDay,
			};

		case 'INIT_CALENDAR_SETTINGS':
			return {
				...INIT_STATE,
				...action.settings,
				sidePane: action.settings.sidePane || 'none',
			};
	} //end switch
} //end actualReducer()
