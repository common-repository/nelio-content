/**
 * Internal dependencies
 */
import type { Timeout } from '../types';

export type UnscheduledPostsAction =
	| UpdateUnscheduledPostsPaginationAction
	| SetIsLoadingUnscheduledPostsAction
	| SetUnscheduledPostsQueryAction
	| SetUnscheduledPostsSearchTimeoutAction;

export function updateUnscheduledPostsPagination(
	query: string,
	lastPageLoaded: number,
	maxPages: number
): UpdateUnscheduledPostsPaginationAction {
	return {
		type: 'UPDATE_UNSCHEDULED_POSTS_PAGINATION',
		query,
		lastPageLoaded,
		maxPages,
	};
} //end updateUnscheduledPostsPagination()

export function setIsLoadingUnscheduledPosts(
	query: string,
	isLoading: boolean
): SetIsLoadingUnscheduledPostsAction {
	return {
		type: 'IS_LOADING_UNSCHEDULED_POSTS',
		query,
		isLoading,
	};
} //end setIsLoadingUnscheduledPosts()

export function setUnscheduledPostsQuery(
	query: string
): SetUnscheduledPostsQueryAction {
	return {
		type: 'SET_UNSCHEDULED_POSTS_QUERY',
		query,
	};
} //end setUnscheduledPostsQuery()

export function setUnscheduledPostsSearchTimeout(
	timeout: Timeout
): SetUnscheduledPostsSearchTimeoutAction {
	return {
		type: 'SET_UNSCHEDULED_POSTS_SEARCH_TIMEOUT',
		timeout,
	};
} //end setUnscheduledPostsSearchTimeout()

// ============
// HELPER TYPES
// ============

type UpdateUnscheduledPostsPaginationAction = {
	readonly type: 'UPDATE_UNSCHEDULED_POSTS_PAGINATION';
	readonly query: string;
	readonly lastPageLoaded: number;
	readonly maxPages: number;
};

type SetIsLoadingUnscheduledPostsAction = {
	readonly type: 'IS_LOADING_UNSCHEDULED_POSTS';
	readonly query: string;
	readonly isLoading: boolean;
};

type SetUnscheduledPostsQueryAction = {
	readonly type: 'SET_UNSCHEDULED_POSTS_QUERY';
	readonly query: string;
};

type SetUnscheduledPostsSearchTimeoutAction = {
	readonly type: 'SET_UNSCHEDULED_POSTS_SEARCH_TIMEOUT';
	readonly timeout: Timeout;
};
