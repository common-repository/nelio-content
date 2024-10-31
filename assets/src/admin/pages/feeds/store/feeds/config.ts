/**
 * External dependencies
 */
import type { FeedId, FeedItem, FeedItemId } from '@nelio-content/types';

export type State = {
	readonly activeFeed: 'all-feeds' | FeedId;
	readonly items: {
		readonly allIds: ReadonlyArray< FeedItemId >;
		readonly byId: Record< FeedItemId, FeedItem >;
		readonly byFeedId: Record< FeedId, ReadonlyArray< FeedItemId > >;
	};
	readonly loadingFeeds: ReadonlyArray< FeedId >;
	readonly loadedFeeds: ReadonlyArray< FeedId >;
};

export const INIT_STATE: State = {
	activeFeed: 'all-feeds',
	items: {
		allIds: [],
		byId: {},
		byFeedId: {},
	},
	loadingFeeds: [],
	loadedFeeds: [],
};
