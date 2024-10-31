/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import type { PaginationInfo } from './config';
import type { State } from '../config';
import type { Timeout } from '../types';

export function getUnscheduledPostsSearchQuery( state: State ): string {
	return state.entities.unscheduledPosts.query || '';
} //end getUnscheduledPostsSearchQuery()

export function getUnscheduledPostsSearchTimeout( state: State ): Timeout {
	return state.entities.unscheduledPosts.searchTimeout;
} //end getUnscheduledPostsSearchTimeout()

export function areThereUnscheduledPostsToLoad(
	state: State,
	query: string
): boolean {
	const defaultPagInfo = getPaginationInfo( state, '' );
	if ( defaultPagInfo.lastPageLoaded >= defaultPagInfo.maxPages ) {
		return false;
	} //end if

	const paginationInfo = getPaginationInfo( state, query );
	return paginationInfo.lastPageLoaded < paginationInfo.maxPages;
} //end areThereUnscheduledPostsToLoad()

export function getLastLoadedPageInUnscheduled(
	state: State,
	query: string
): number {
	const paginationInfo = getPaginationInfo( state, query );
	return paginationInfo.lastPageLoaded;
} //end getLastLoadedPageInUnscheduled()

export function isLoadingUnscheduledPosts(
	state: State,
	query: string
): boolean {
	if ( ! areThereUnscheduledPostsToLoad( state, '' ) ) {
		return false;
	} //end if

	const paginationInfo = getPaginationInfo( state, query );
	return paginationInfo.isLoading;
} //end isLoadingUnscheduledPosts()

// =======
// HELPERS
// =======

const DEFAULT_PAGINATION_INFO: PaginationInfo = {
	lastPageLoaded: 0,
	maxPages: 1,
	isLoading: false,
};

function getPaginationInfo( state: State, query: string ) {
	query = trim( query );

	if ( query ) {
		return {
			...DEFAULT_PAGINATION_INFO,
			...state.entities.unscheduledPosts.byQueryPagination[ query ],
		};
	} //end if

	return state.entities.unscheduledPosts.defaultPagination;
} //end getPaginationInfo()
