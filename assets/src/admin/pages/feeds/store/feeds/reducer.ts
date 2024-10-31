/**
 * External dependencies
 */
import { keyBy, map, reverse, sortBy, uniq, values, without } from 'lodash';
import { decodeHtmlEntities } from '@nelio-content/utils';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { FeedAction as Action } from './actions';
import type { State } from './config';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_ACTIVE_FEED':
			return {
				...state,
				activeFeed: action.feedId,
			};

		case 'RECEIVE_ITEMS': {
			const items = map( action.items, ( item ) => ( {
				...item,
				title: decodeHtmlEntities( item.title ),
				excerpt: decodeHtmlEntities( item.excerpt ),
				authors: map( item.authors, decodeHtmlEntities ),
			} ) );

			const allItems = [ ...values( state.items.byId ), ...items ];
			const allSorted = map(
				reverse( sortBy( allItems, 'date' ) ),
				'id'
			);

			const byFeed = map(
				state.items.byFeedId[ action.feedId ],
				( id ) => state.items.byId[ id ]
			);
			const allByFeed = [ ...values( byFeed ), ...items ];
			const allByFeedSorted = map(
				reverse( sortBy( allByFeed, 'date' ) ),
				'id'
			);

			return {
				...state,
				items: {
					allIds: uniq( allSorted ),
					byId: keyBy( allItems, 'id' ),
					byFeedId: {
						...state.items.byFeedId,
						[ action.feedId ]: uniq( allByFeedSorted ),
					},
				},
			};
		}

		case 'MARK_FEED_AS_LOADING':
			if ( ! action.isLoading ) {
				return {
					...state,
					loadingFeeds: without( state.loadingFeeds, action.feedId ),
				};
			} //end if

			return {
				...state,
				loadingFeeds: uniq( [ ...state.loadingFeeds, action.feedId ] ),
				loadedFeeds: without( state.loadingFeeds, action.feedId ),
			};

		case 'MARK_FEED_AS_LOADED':
			return {
				...state,
				loadingFeeds: without( state.loadingFeeds, action.feedId ),
				loadedFeeds: uniq( [ ...state.loadedFeeds, action.feedId ] ),
			};
	} //end switch
} //end actualReducer()
