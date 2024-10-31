export type PremiumComponentName =
	| 'calendar/future-action-editor'
	| 'calendar/future-actions-filter'
	| 'gutenberg-editor/future-actions-panel'
	| 'post-page/future-action-editor'
	| 'post-page/future-actions'
	| 'pqe/future-actions';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PremiumComponents {}

export interface PremiumCalendarFilters {
	readonly _: false;
}

export type PremiumFeature =
	| 'analytics/create-messages'
	| 'calendar/create-messages'
	| 'calendar/create-reusable-messages'
	| 'calendar/create-tasks'
	| 'calendar/edit-reusable-messages'
	| 'calendar/export'
	| 'calendar/schedule-reusable-messages'
	| 'edit-post/create-more-messages'
	| 'edit-post/custom-timeline'
	| 'feeds/share-post'
	| 'raw/automation-groups'
	| 'raw/editorial-comments'
	| 'raw/editorial-tasks'
	| 'raw/free-previews'
	| 'raw/future-actions'
	| 'raw/task-presets'
	| 'settings/more-profiles'
	| 'settings/more-profiles-in-network';
