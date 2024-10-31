/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ProfileEditorAction as Action } from '../actions/profile-editor';

type State = FullState[ 'profileEditor' ];

export function profileEditor(
	state = INIT_STATE.profileEditor,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end profileEditor()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_PROFILE_EDITOR':
			return {
				profileId: action.profileId,
				isSaving: false,
				settings: action.settings,
			};

		case 'CLOSE_PROFILE_EDITOR':
			return {
				...state,
				profileId: undefined,
			};

		case 'MARK_AS_SAVING_PROFILE_SETTINGS':
			return {
				...state,
				isSaving: action.saving,
			};

		case 'SET_EDITING_EMAIL':
			return {
				...state,
				settings: {
					...state.settings,
					email: action.email,
				},
			};

		case 'SET_EDITING_QUERY_ARGS':
			return {
				...state,
				settings: {
					...state.settings,
					permalinkQueryArgs: action.args,
				},
			};
	} //end switch
} //end actualReducer()
