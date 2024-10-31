/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type { FeedId, FeedItem, FeedItemId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';

export function getActiveFeed( state: State ): 'all-feeds' | FeedId {
	return state.feeds.activeFeed || 'all-feeds';
} //end getActiveFeed()

export function isLoadingFeed( state: State, feedId: FeedId ): boolean {
	return state.feeds.loadingFeeds.includes( feedId );
} //end isLoadingFeed()

export function isLoadingAFeed( state: State ): boolean {
	return ! isEmpty( state.feeds.loadingFeeds );
} //end isLoadingAFeed()

export function isFeedLoaded( state: State, feedId: FeedId ): boolean {
	return state.feeds.loadedFeeds.includes( feedId );
} //end isFeedLoaded()

export function getItem( state: State, itemId: FeedItemId ): Maybe< FeedItem > {
	return state.feeds.items.byId[ itemId ];
} //end getItem()

export function getAllItems( state: State ): ReadonlyArray< FeedItemId > {
	return state.feeds.items.allIds;
} //end getAllItems()

export function getAllItemsInFeed(
	state: State,
	feedId: FeedId
): ReadonlyArray< FeedItemId > {
	return state.feeds.items.byFeedId[ feedId ] || [];
} //end getAllItemsInFeed()
