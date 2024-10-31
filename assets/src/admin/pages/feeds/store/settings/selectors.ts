/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type { FeedId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';

export function areSettingsVisible( state: State ): boolean {
	return state.settings.active;
} //end areSettingsVisible()

export function getFeedUrl( state: State ): string {
	return state.settings.addFeedForm.url;
} //end getFeedUrl()

export function isAddingAFeed( state: State ): boolean {
	return state.settings.addFeedForm.isAddingFeed;
} //end isAddingAFeed()

export function getEditingFeedId( state: State ): Maybe< FeedId > {
	return state.settings.feedEditor?.feedId;
} //end getEditingFeedId()

export function getEditingFeedName( state: State ): string {
	return state.settings.feedEditor?.feedName ?? '';
} //end getEditingFeedName()

export function getEditingFeedTwitter( state: State ): string {
	return state.settings.feedEditor?.feedTwitter ?? '';
} //end getEditingFeedTwitter()

export function isSavingAFeed( state: State ): boolean {
	return !! state.settings.feedEditor?.isSaving;
} //end isSavingAFeed()

export function isDeletingFeed( state: State, feedId: FeedId ): boolean {
	return state.settings.feedsBeingDeleted.includes( feedId );
} //end isDeletingFeed()

export function isDeletingAFeed( state: State ): boolean {
	return ! isEmpty( state.settings.feedsBeingDeleted );
} //end isDeletingAFeed()
