/**
 * External dependencies
 */
import type {
	AuthorId,
	InternalEventType,
	Maybe,
	PostTypeName,
	PremiumCalendarFilters,
	SocialNetworkName,
	TaxonomySlug,
	TermId,
	Url,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { CalendarFilters, FilterPaneTab } from './config';

export type FilterAction =
	| SetActiveTabInFilterPaneAction
	| ClearFiltersAction
	| SetDisabledInternalEventTypesAction
	| SetDisabledExternalCalendarsAction
	| SetDisabledPostTypeTerms
	| SetDisabledPostTypesAction
	| SetDisabledStatusesAction
	| SetDisabledSocialProfilesInNetworkAction
	| SetPostAuthorFilterAction
	| ToggleTasksVisibilityAction
	| SetTaskAssigneeFilterAction
	| CollapseSocialMessagesInDayAction
	| ShowFailedMessagesAction
	| ShowAutomaticMessagesAction
	| LoadPreviousFiltersAction
	| SetPremiumFilter< keyof PremiumCalendarFilters >;

export function setActiveTabInFilterPane(
	tabName: FilterPaneTab
): SetActiveTabInFilterPaneAction {
	return {
		type: 'SET_ACTIVE_TAB_IN_FILTER_PANE',
		tabName,
	};
} //end setActiveTabInFilterPane()

export function clearFilters(): ClearFiltersAction {
	return {
		type: 'CLEAR_FILTERS',
	};
} //end clearFilters()

export function setDisabledInternalEventTypes(
	internalEventTypes: ReadonlyArray< InternalEventType >
): SetDisabledInternalEventTypesAction {
	return {
		type: 'SET_DISABLED_INTERNAL_EVENT_TYPES',
		internalEventTypes,
	};
} //end setDisabledInternalEventTypes()

export function setDisabledExternalCalendars(
	externalCalendars: ReadonlyArray< Url >
): SetDisabledExternalCalendarsAction {
	return {
		type: 'SET_DISABLED_EXTERNAL_CALENDARS',
		externalCalendars,
	};
} //end setDisabledExternalCalendars()

export function setDisabledPostTypeTerms(
	postType: PostTypeName,
	taxonomy: TaxonomySlug,
	terms: ReadonlyArray< TermId >
): SetDisabledPostTypeTerms {
	return {
		type: 'SET_DISABLED_POST_TYPE_TERMS',
		postType,
		taxonomy,
		terms,
	};
} //end setDisabledPostTypeTerms()

export function setDisabledPostTypes(
	postTypes: ReadonlyArray< PostTypeName >
): SetDisabledPostTypesAction {
	return {
		type: 'SET_DISABLED_POST_TYPES',
		postTypes,
	};
} //end setDisabledPostTypes()

export function setDisabledStatuses(
	statuses: ReadonlyArray< string >
): SetDisabledStatusesAction {
	return {
		type: 'SET_DISABLED_STATUSES',
		statuses,
	};
} //end setDisabledStatuses()

export function setDisabledSocialProfilesInNetwork(
	network: SocialNetworkName,
	profiles: ReadonlyArray< Uuid >
): SetDisabledSocialProfilesInNetworkAction {
	return {
		type: 'SET_DISABLED_PROFILES_IN_NETWORK',
		network,
		disabledProfiles: profiles,
	};
} //end setDisabledSocialProfilesInNetwork()

export function setPostAuthorFilter(
	authorId: Maybe< AuthorId >
): SetPostAuthorFilterAction {
	return {
		type: 'SET_POST_AUTHOR_FILTER',
		authorId,
	};
} //end setPostAuthorFilter()

export function toggleTasksVisibility(): ToggleTasksVisibilityAction {
	return {
		type: 'TOGGLE_TASKS_VISIBILITY',
	};
} //end toggleTasksVisibility()

export function setTaskAssigneeFilter(
	assigneeId: Maybe< AuthorId >
): SetTaskAssigneeFilterAction {
	return {
		type: 'SET_TASK_ASSIGNEE_FILTER',
		assigneeId,
	};
} //end setTaskAssigneeFilter()

export function collapseSocialMessagesInDay(
	areMessagesCollapsed: boolean,
	day: string
): CollapseSocialMessagesInDayAction {
	return {
		type: 'COLLAPSE_MESSAGES_IN_DAY',
		day,
		areMessagesCollapsed,
	};
} //end collapseSocialMessagesInDay()

export function showFailedMessages(
	areFailedMessagesVisible: boolean
): ShowFailedMessagesAction {
	return {
		type: 'SHOW_FAILED_MESSAGES',
		areFailedMessagesVisible,
	};
} //end showFailedMessages()

export function showAutomaticMessages(
	areAutomaticMessagesVisible: boolean
): ShowAutomaticMessagesAction {
	return {
		type: 'SHOW_AUTOMATIC_MESSAGES',
		areAutomaticMessagesVisible,
	};
} //end showAutomaticMessages()

export function loadPreviousFilters(
	filters: Partial< CalendarFilters >
): Maybe< LoadPreviousFiltersAction > {
	if ( 'object' !== typeof filters ) {
		return;
	} //end if

	return {
		type: 'LOAD_PREVIOUS_FILTERS',
		filters,
	};
} //end loadPreviousFilters()

export function setPremiumFilter< TName extends keyof PremiumCalendarFilters >(
	filterName: TName,
	value: PremiumCalendarFilters[ TName ]
): SetPremiumFilter< TName > {
	return {
		type: 'SET_PREMIUM_FILTER',
		filterName,
		value,
	};
} //end setPremiumFilter()

// ============
// HELPER TYPES
// ============

type SetActiveTabInFilterPaneAction = {
	readonly type: 'SET_ACTIVE_TAB_IN_FILTER_PANE';
	readonly tabName: FilterPaneTab;
};

type ClearFiltersAction = {
	readonly type: 'CLEAR_FILTERS';
};

type SetDisabledInternalEventTypesAction = {
	readonly type: 'SET_DISABLED_INTERNAL_EVENT_TYPES';
	readonly internalEventTypes: ReadonlyArray< InternalEventType >;
};

type SetDisabledExternalCalendarsAction = {
	readonly type: 'SET_DISABLED_EXTERNAL_CALENDARS';
	readonly externalCalendars: ReadonlyArray< Url >;
};

type SetDisabledPostTypeTerms = {
	readonly type: 'SET_DISABLED_POST_TYPE_TERMS';
	readonly postType: PostTypeName;
	readonly taxonomy: TaxonomySlug;
	readonly terms: ReadonlyArray< TermId >;
};

type SetDisabledPostTypesAction = {
	readonly type: 'SET_DISABLED_POST_TYPES';
	readonly postTypes: ReadonlyArray< PostTypeName >;
};

type SetDisabledStatusesAction = {
	readonly type: 'SET_DISABLED_STATUSES';
	readonly statuses: ReadonlyArray< string >;
};

type SetDisabledSocialProfilesInNetworkAction = {
	readonly type: 'SET_DISABLED_PROFILES_IN_NETWORK';
	readonly network: SocialNetworkName;
	readonly disabledProfiles: ReadonlyArray< Uuid >;
};

type SetPostAuthorFilterAction = {
	readonly type: 'SET_POST_AUTHOR_FILTER';
	readonly authorId: Maybe< AuthorId >;
};

type ToggleTasksVisibilityAction = {
	readonly type: 'TOGGLE_TASKS_VISIBILITY';
};

type SetTaskAssigneeFilterAction = {
	readonly type: 'SET_TASK_ASSIGNEE_FILTER';
	readonly assigneeId: Maybe< AuthorId >;
};

type CollapseSocialMessagesInDayAction = {
	readonly type: 'COLLAPSE_MESSAGES_IN_DAY';
	readonly day: string;
	readonly areMessagesCollapsed: boolean;
};

type ShowFailedMessagesAction = {
	readonly type: 'SHOW_FAILED_MESSAGES';
	readonly areFailedMessagesVisible: boolean;
};

type ShowAutomaticMessagesAction = {
	readonly type: 'SHOW_AUTOMATIC_MESSAGES';
	readonly areAutomaticMessagesVisible: boolean;
};

type LoadPreviousFiltersAction = {
	readonly type: 'LOAD_PREVIOUS_FILTERS';
	readonly filters: Partial< CalendarFilters >;
};

type SetPremiumFilter< TName extends keyof PremiumCalendarFilters > = {
	readonly type: 'SET_PREMIUM_FILTER';
	readonly filterName: TName;
	readonly value: PremiumCalendarFilters[ TName ];
};
