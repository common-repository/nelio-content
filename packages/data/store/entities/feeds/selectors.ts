/**
 * External dependencies
 */
import { keys, values } from 'lodash';
import type { Feed, FeedId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getFeed( state: State, feedId: FeedId ): Maybe< Feed > {
	return state.entities.feeds[ feedId ];
} //end getFeed()

export function getFeeds( state: State ): ReadonlyArray< Feed > {
	return values( state.entities.feeds );
} //end getFeeds()

export function getFeedIds( state: State ): ReadonlyArray< FeedId > {
	return keys( state.entities.feeds );
} //end getFeedIds()
