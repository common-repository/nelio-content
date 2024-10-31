/**
 * WordPress dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { SettingsAction as Action } from '../actions/settings';

type State = FullState[ 'settings' ];

export function settings(
	state = INIT_STATE.settings,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end settings()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_EDITOR_TO_CLASSIC':
			return {
				...state,
				isClassicEditor: action.isClassicEditor,
			};

		case 'SET_EDITOR_TO_ELEMENTOR':
			return {
				...state,
				isElementorEditor: action.isElementorEditor,
			};

		case 'PANEL_SETTINGS':
			return {
				...state,
				panels: action.settings,
			};

		case 'TOGGLE_PANEL':
			if ( state.panels[ action.panelName ] === action.isOpen ) {
				return state;
			} //end if

			return {
				...state,
				panels: {
					...state.panels,
					[ action.panelName ]: action.isOpen,
				},
			};

		case 'INCLUDE_AUTHOR_IN_FOLLOWERS':
			return {
				...state,
				shouldAuthorBeFollower: action.shouldAuthorBeFollower,
			};

		case 'SET_AUTO_SHARE_END_MODES':
			return {
				...state,
				autoShareEndModes: action.autoShareEndModes,
			};
	} //end switch
} //end reducer()
