/**
 * External dependencies
 */
import type { Feed, FeedId } from '@nelio-content/types';

export type SettingsAction =
	| ShowSettings
	| SetNewFeedUrlAction
	| MarkAsAddingFeedAction
	| OpenEditorAction
	| CloseEditorAction
	| SetEditingFeedNameAction
	| SetEditingFeedTwitterAction
	| MarkAsSavingAction
	| MarkAsDeletingAction;

export function showSettings( visible: boolean ): ShowSettings {
	return {
		type: 'SHOW_SETTINGS',
		visible,
	};
} //end showSettings()

export function setNewFeedUrl( url: string ): SetNewFeedUrlAction {
	return {
		type: 'SET_NEW_FEED_URL',
		url,
	};
} //end setFieldValue()

export function markAsAddingFeed(
	isAddingFeed: boolean
): MarkAsAddingFeedAction {
	return {
		type: 'MARK_AS_ADDING_FEED',
		isAddingFeed,
	};
} //end markAsAddingFeed()

export function openEditor(
	feedId: FeedId,
	{ name, twitter }: Pick< Feed, 'name' | 'twitter' >
): OpenEditorAction {
	return {
		type: 'OPEN_EDITOR',
		feedId,
		feedName: name,
		feedTwitter: twitter,
	};
} //end openEditor()

export function closeEditor(): CloseEditorAction {
	return {
		type: 'CLOSE_EDITOR',
	};
} //end closeEditor()

export function setEditingFeedName(
	feedName: string
): SetEditingFeedNameAction {
	return {
		type: 'SET_EDITING_FEED_NAME',
		feedName,
	};
} //end setEditingFeedName()

export function setEditingFeedTwitter(
	feedTwitter: string
): SetEditingFeedTwitterAction {
	return {
		type: 'SET_EDITING_FEED_TWITTER',
		feedTwitter,
	};
} //end setEditingFeedTwitter()

export function markAsSaving( isSaving: boolean ): MarkAsSavingAction {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

export function markAsDeleting(
	feedId: FeedId,
	isDeleting: boolean
): MarkAsDeletingAction {
	return {
		type: 'MARK_AS_DELETING',
		feedId,
		isDeleting,
	};
} //end markAsDeleting()

// ============
// HELPER TYPES
// ============

type ShowSettings = {
	readonly type: 'SHOW_SETTINGS';
	readonly visible: boolean;
};

type SetNewFeedUrlAction = {
	readonly type: 'SET_NEW_FEED_URL';
	readonly url: string;
};

type MarkAsAddingFeedAction = {
	readonly type: 'MARK_AS_ADDING_FEED';
	readonly isAddingFeed: boolean;
};

type OpenEditorAction = {
	readonly type: 'OPEN_EDITOR';
	readonly feedId: FeedId;
	readonly feedName: string;
	readonly feedTwitter: string;
};

type CloseEditorAction = {
	readonly type: 'CLOSE_EDITOR';
};

type SetEditingFeedNameAction = {
	readonly type: 'SET_EDITING_FEED_NAME';
	readonly feedName: string;
};

type SetEditingFeedTwitterAction = {
	readonly type: 'SET_EDITING_FEED_TWITTER';
	readonly feedTwitter: string;
};

type MarkAsSavingAction = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};

type MarkAsDeletingAction = {
	readonly type: 'MARK_AS_DELETING';
	readonly feedId: FeedId;
	readonly isDeleting: boolean;
};
