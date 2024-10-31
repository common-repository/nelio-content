/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './config';
import type { FilterAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'CLEAR_FILTERS':
			return INIT_STATE;

		case 'SET_ACTIVE_TAB_IN_FILTER_PANE':
			return {
				...state,
				activeTab: action.tabName,
			};

		case 'SET_DISABLED_POST_TYPE_TERMS':
			return {
				...state,
				disabledPostTypeTerms: {
					...state.disabledPostTypeTerms,
					[ action.postType ]: {
						...state.disabledPostTypeTerms[ action.postType ],
						[ action.taxonomy ]: action.terms,
					},
				},
			};

		case 'SET_DISABLED_STATUSES':
			return {
				...state,
				disabledStatuses: action.statuses,
			};

		case 'SET_DISABLED_INTERNAL_EVENT_TYPES':
			return {
				...state,
				disabledInternalEventTypes: action.internalEventTypes,
			};

		case 'SET_DISABLED_EXTERNAL_CALENDARS':
			return {
				...state,
				disabledExternalCalendars: action.externalCalendars,
			};

		case 'SET_DISABLED_POST_TYPES':
			return {
				...state,
				disabledPostTypes: action.postTypes,
			};

		case 'SET_POST_AUTHOR_FILTER':
			return {
				...state,
				postAuthor: action.authorId,
			};

		case 'SET_DISABLED_PROFILES_IN_NETWORK':
			return {
				...state,
				disabledSocialProfilesByNetwork: {
					...state.disabledSocialProfilesByNetwork,
					[ action.network ]: action.disabledProfiles,
				},
			};

		case 'TOGGLE_TASKS_VISIBILITY':
			return {
				...state,
				areTasksVisible: ! state.areTasksVisible,
			};

		case 'SET_TASK_ASSIGNEE_FILTER':
			return {
				...state,
				taskAssignee: action.assigneeId,
			};

		case 'COLLAPSE_MESSAGES_IN_DAY':
			return {
				...state,
				areAllMessagesVisibleInDay: {
					...state.areAllMessagesVisibleInDay,
					[ action.day ]: ! action.areMessagesCollapsed,
				},
			};

		case 'SHOW_FAILED_MESSAGES':
			return {
				...state,
				areFailedMessagesVisible: !! action.areFailedMessagesVisible,
			};

		case 'SHOW_AUTOMATIC_MESSAGES':
			return {
				...state,
				areAutomaticMessagesVisible:
					!! action.areAutomaticMessagesVisible,
			};

		case 'LOAD_PREVIOUS_FILTERS':
			return {
				...state,
				...action.filters,
			};

		case 'SET_PREMIUM_FILTER':
			return {
				...state,
				premium: {
					...state.premium,
					[ action.filterName ]: action.value,
				},
			};
	} //end switch
} //end actualReducer()
