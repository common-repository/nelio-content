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

export type State = CalendarFilters & {
	readonly activeTab: FilterPaneTab;
	readonly areAllMessagesVisibleInDay: Record< string, boolean >;
};

export const INIT_STATE: State = {
	activeTab: 'post',
	areAllMessagesVisibleInDay: {},
	disabledInternalEventTypes: [],
	disabledExternalCalendars: [],
	disabledPostTypes: [],
	disabledPostTypeTerms: {},
	disabledPostAuthors: [],
	disabledSocialProfilesByNetwork: {},
	disabledStatuses: [],
	areTasksVisible: true,
	taskAssignee: undefined,
	postAuthor: undefined,
	areFailedMessagesVisible: true,
	areAutomaticMessagesVisible: true,
	premium: {},
};

// ============
// HELPER TYPES
// ============

export type CalendarFilters = {
	readonly disabledInternalEventTypes: ReadonlyArray< InternalEventType >;
	readonly disabledExternalCalendars: ReadonlyArray< Url >;
	readonly disabledPostTypes: ReadonlyArray< PostTypeName >;
	readonly disabledPostTypeTerms: Partial<
		Record< PostTypeName, Record< TaxonomySlug, ReadonlyArray< TermId > > >
	>;
	readonly disabledPostAuthors: ReadonlyArray< AuthorId >;
	readonly disabledSocialProfilesByNetwork: Partial<
		Record< SocialNetworkName, ReadonlyArray< Uuid > >
	>;
	readonly disabledStatuses: ReadonlyArray< string >;
	readonly areTasksVisible: boolean;
	readonly taskAssignee: Maybe< AuthorId >;
	readonly postAuthor: Maybe< AuthorId >;
	readonly areFailedMessagesVisible: boolean;
	readonly areAutomaticMessagesVisible: boolean;
	readonly premium: Partial< Omit< PremiumCalendarFilters, '_' > >;
};

export type FilterPaneTab = 'post' | 'social' | 'task' | 'event';
