/**
 * External dependencies
 */
import type { FeedId, FeedItem } from '@nelio-content/types';

export type FeedAction =
	| SetActiveFeedAction
	| ReceiveItemsAction
	| MarkFeedAsLoadingAction
	| MarkFeedAsLoadedAction;

export function setActiveFeed(
	feedId: FeedId | 'all-feeds'
): SetActiveFeedAction {
	return {
		type: 'SET_ACTIVE_FEED',
		feedId,
	};
} //end setActiveFeed()

export function receiveItems(
	feedId: FeedId,
	items: ReadonlyArray< FeedItem >
): ReceiveItemsAction {
	return {
		type: 'RECEIVE_ITEMS',
		feedId,
		items,
	};
} //end receiveItems()

export function markFeedAsLoading(
	feedId: FeedId,
	isLoading: boolean
): MarkFeedAsLoadingAction {
	return {
		type: 'MARK_FEED_AS_LOADING',
		feedId,
		isLoading,
	};
} //end markFeedAsLoading()

export function markFeedAsLoaded( feedId: FeedId ): MarkFeedAsLoadedAction {
	return {
		type: 'MARK_FEED_AS_LOADED',
		feedId,
	};
} //end markFeedAsLoaded()

// ============
// HELPER ITEMS
// ============

type SetActiveFeedAction = {
	readonly type: 'SET_ACTIVE_FEED';
	readonly feedId: FeedId | 'all-feeds';
};

type ReceiveItemsAction = {
	readonly type: 'RECEIVE_ITEMS';
	readonly feedId: FeedId;
	readonly items: ReadonlyArray< FeedItem >;
};

type MarkFeedAsLoadingAction = {
	readonly type: 'MARK_FEED_AS_LOADING';
	readonly feedId: FeedId;
	readonly isLoading: boolean;
};

type MarkFeedAsLoadedAction = {
	readonly type: 'MARK_FEED_AS_LOADED';
	readonly feedId: FeedId;
};
