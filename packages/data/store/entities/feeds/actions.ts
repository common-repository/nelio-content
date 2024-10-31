/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Feed, FeedId } from '@nelio-content/types';

export type FeedAction = ReceiveFeeds | RemoveFeed;

export function receiveFeeds(
	feeds: Feed | ReadonlyArray< Feed >
): ReceiveFeeds {
	return {
		type: 'RECEIVE_FEEDS',
		feeds: castArray( feeds ),
	};
} //end receiveFeeds()

export function removeFeed( id: FeedId ): RemoveFeed {
	return {
		type: 'REMOVE_FEED',
		id,
	};
} //end removeFeed()

// ============
// HELPER TYPES
// ============

type ReceiveFeeds = {
	readonly type: 'RECEIVE_FEEDS';
	readonly feeds: ReadonlyArray< Feed >;
};

type RemoveFeed = {
	readonly type: 'REMOVE_FEED';
	readonly id: FeedId;
};
