/**
 * External dependencies
 */
import { keyBy, omit, uniq, without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './config';
import type { Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MANAGE_EXTERNAL_CALENDARS':
			return {
				...state,
				isManaging: action.isActive,
			};

		case 'RECEIVE_EXTERNAL_CALENDARS':
			return {
				...state,
				byUrl: {
					...state.byUrl,
					...keyBy( action.externalCalendars, 'url' ),
				},
			};

		case 'REMOVE_EXTERNAL_CALENDAR':
			return {
				...state,
				byUrl: omit( state.byUrl, action.url ),
			};

		case 'OPEN_EXTERNAL_EDITOR_CALENDAR':
			return {
				...state,
				editor: {
					isNew: ! action.url,
					isSaving: false,
					url: action.url,
					name: action.name,
				},
			};

		case 'CLOSE_EXTERNAL_CALENDAR_EDITOR':
			return {
				...state,
				editor: undefined,
			};

		case 'SET_EDITING_EXTERNAL_CALENDAR_URL':
			if ( ! state.editor || ! state.editor.isNew ) {
				return state;
			} //end if

			return {
				...state,
				editor: {
					...state.editor,
					url: action.url,
				},
			};

		case 'SET_EDITING_EXTERNAL_CALENDAR_NAME':
			if ( ! state.editor ) {
				return state;
			} //end if

			return {
				...state,
				editor: {
					...state.editor,
					name: action.name,
				},
			};

		case 'MARK_AS_SAVING':
			if ( ! state.editor ) {
				return state;
			} //end if

			return {
				...state,
				editor: {
					...state.editor,
					isSaving: action.isSaving,
				},
			};

		case 'MARK_AS_DELETING':
			return {
				...state,
				deleting: action.isDeleting
					? uniq( [ ...state.deleting, action.url ] )
					: without( state.deleting, action.url ),
			};
	} //end switch
} //end actualReducer()
