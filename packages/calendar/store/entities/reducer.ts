/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State, PaginationInfo } from './config';
import type { UnscheduledPostsAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_UNSCHEDULED_POSTS_QUERY':
			return {
				...state,
				unscheduledPosts: {
					...state.unscheduledPosts,
					query: action.query,
				},
			};

		case 'SET_UNSCHEDULED_POSTS_SEARCH_TIMEOUT':
			return {
				...state,
				unscheduledPosts: {
					...state.unscheduledPosts,
					searchTimeout: action.timeout,
				},
			};

		case 'UPDATE_UNSCHEDULED_POSTS_PAGINATION':
			if ( action.query ) {
				return {
					...state,
					unscheduledPosts: {
						...state.unscheduledPosts,
						byQueryPagination: {
							...state.unscheduledPosts.byQueryPagination,
							[ action.query ]: {
								...EMPTY_PAGINATION,
								...state.unscheduledPosts.byQueryPagination[
									action.query
								],
								lastPageLoaded: action.lastPageLoaded,
								maxPages: action.maxPages,
							},
						},
					},
				};
			} //end if

			return {
				...state,
				unscheduledPosts: {
					...state.unscheduledPosts,
					defaultPagination: {
						...state.unscheduledPosts.defaultPagination,
						lastPageLoaded: action.lastPageLoaded,
						maxPages: action.maxPages,
					},
				},
			};

		case 'IS_LOADING_UNSCHEDULED_POSTS':
			if ( action.query ) {
				return {
					...state,
					unscheduledPosts: {
						...state.unscheduledPosts,
						byQueryPagination: {
							...state.unscheduledPosts.byQueryPagination,
							[ action.query ]: {
								...EMPTY_PAGINATION,
								...state.unscheduledPosts.byQueryPagination[
									action.query
								],
								isLoading: action.isLoading,
							},
						},
					},
				};
			} //end if

			return {
				...state,
				unscheduledPosts: {
					...state.unscheduledPosts,
					defaultPagination: {
						...state.unscheduledPosts.defaultPagination,
						isLoading: action.isLoading,
					},
				},
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

const EMPTY_PAGINATION: PaginationInfo = {
	lastPageLoaded: 0,
	maxPages: 1,
	isLoading: false,
};
