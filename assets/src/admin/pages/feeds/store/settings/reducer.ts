/**
 * External dependencies
 */
import { uniq, without } from 'lodash';
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
		case 'SHOW_SETTINGS':
			return {
				...state,
				active: action.visible,
			};

		case 'SET_NEW_FEED_URL':
			return {
				...state,
				addFeedForm: {
					...state.addFeedForm,
					url: action.url,
				},
			};

		case 'MARK_AS_ADDING_FEED':
			return {
				...state,
				addFeedForm: {
					...state.addFeedForm,
					isAddingFeed: !! action.isAddingFeed,
				},
			};

		case 'OPEN_EDITOR':
			return {
				...state,
				feedEditor: {
					isSaving: false,
					feedId: action.feedId,
					feedName: action.feedName,
					feedTwitter: action.feedTwitter,
				},
			};

		case 'CLOSE_EDITOR':
			return {
				...state,
				feedEditor: undefined,
			};

		case 'SET_EDITING_FEED_NAME':
			if ( ! state.feedEditor ) {
				return state;
			} //end if

			return {
				...state,
				feedEditor: {
					...state.feedEditor,
					feedName: action.feedName,
				},
			};

		case 'SET_EDITING_FEED_TWITTER':
			if ( ! state.feedEditor ) {
				return state;
			} //end if

			return {
				...state,
				feedEditor: {
					...state.feedEditor,
					feedTwitter: action.feedTwitter,
				},
			};

		case 'MARK_AS_SAVING':
			if ( ! state.feedEditor ) {
				return state;
			} //end if

			return {
				...state,
				feedEditor: {
					...state.feedEditor,
					isSaving: action.isSaving,
				},
			};

		case 'MARK_AS_DELETING':
			return {
				...state,
				feedsBeingDeleted: action.isDeleting
					? uniq( [ ...state.feedsBeingDeleted, action.feedId ] )
					: without( state.feedsBeingDeleted, action.feedId ),
			};
	} //end switch
} //end actualReducer()
