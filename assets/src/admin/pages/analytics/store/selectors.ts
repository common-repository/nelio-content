/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type {
	AuthorId,
	Maybe,
	PostId,
	PostTypeName,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { stringifyCriteria } from './utils';
import type {
	FilterCriteria,
	PeriodMode,
	PeriodValue,
	SortCriterion,
	State,
} from './types';

export function getSortingCriterion( state: State ): SortCriterion {
	return state.sortBy;
} //end getSortingCriterion()

export function getPeriodFilterMode( state: State ): PeriodMode {
	return state.filters.period.mode;
} //end getPeriodFilterMode()

export function getPeriodFilterValue( state: State ): PeriodValue {
	return state.filters.period.value;
} //end getPeriodFilterValue()

export function getAuthorFilter( state: State ): Maybe< AuthorId > {
	return state.filters.author;
} //end getAuthorFilter()

export function getPostTypeFilter( state: State ): Maybe< PostTypeName > {
	return state.filters.postType;
} //end getPostTypeFilter()

export function getFilterCriteria( state: State ): FilterCriteria {
	return {
		sortBy: getSortingCriterion( state ),
		author: getAuthorFilter( state ),
		postType: getPostTypeFilter( state ),
		periodMode: getPeriodFilterMode( state ),
		periodValue: getPeriodFilterValue( state ),
	};
} //end getFilterCriteria()

export function getPostIdsMatchingCriteria(
	state: State,
	criteria: FilterCriteria
): ReadonlyArray< PostId > {
	return state.postsByCriteria[ stringifyCriteria( criteria ) ] || [];
} //end getPostIdsMatchingCriteria()

export function isLoadingPostsWithCriteria(
	state: State,
	criteria: FilterCriteria
): boolean {
	return state.status.loading.includes( stringifyCriteria( criteria ) );
} //end isLoadingPostsWithCriteria()

export function arePostsWithCriteriaFullyLoaded(
	state: State,
	criteria: FilterCriteria
): boolean {
	const pagination = state.status.pagination[ stringifyCriteria( criteria ) ];
	if ( isEmpty( pagination ) ) {
		return false;
	} //end if
	return !! pagination.isFullyLoaded;
} //end arePostsWithCriteriaFullyLoaded()

export function getNextPageToLoad(
	state: State,
	criteria: FilterCriteria
): number {
	const pagination = state.status.pagination[ stringifyCriteria( criteria ) ];
	return ( pagination?.lastLoadedPage ?? 0 ) + 1;
} //end getNextPageToLoad()

export function getPostIds( state: State ): ReadonlyArray< PostId > {
	const criteria = getFilterCriteria( state );
	return getPostIdsMatchingCriteria( state, criteria );
} //end getPostIds()

export function isLoadingPosts( state: State ): boolean {
	const criteria = getFilterCriteria( state );
	return isLoadingPostsWithCriteria( state, criteria );
} //end isLoadingPosts()

export function arePostsFullyLoaded( state: State ): boolean {
	const criteria = getFilterCriteria( state );
	return arePostsWithCriteriaFullyLoaded( state, criteria );
} //end arePostsFullyLoaded()
