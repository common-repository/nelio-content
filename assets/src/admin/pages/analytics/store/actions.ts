/**
 * External dependencies
 */
import type { AuthorId, Maybe, Post, PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type {
	FilterCriteria,
	PaginationInfo,
	PeriodMode,
	PeriodValue,
	SortCriterion,
} from './types';

export type Action =
	| SortByAction
	| SetPeriodFilterAction
	| SetAuthorFilterAction
	| SetPostTypeFilterAction
	| ReceivePostsMatchingCriteriaAction
	| MarkFilterCriteriaAsLoadingAction
	| UpdateFilterCriteriaPaginationAction;

export function sortBy( criterion: SortCriterion ): SortByAction {
	return {
		type: 'SORT_BY',
		criterion,
	};
} //end sortBy()

export function setPeriodFilter(
	mode: PeriodMode,
	value: PeriodValue
): SetPeriodFilterAction {
	return {
		type: 'SET_PERIOD_FILTER',
		mode,
		value,
	};
} //end setPeriodFilter()

export function setAuthorFilter(
	author: Maybe< AuthorId >
): SetAuthorFilterAction {
	return {
		type: 'SET_AUTHOR_FILTER',
		author,
	};
} //end setAuthorFilter()

// TODO. Can I load all post types at once? Or do I need to force one?
export function setPostTypeFilter(
	postType: Maybe< PostTypeName >
): SetPostTypeFilterAction {
	return {
		type: 'SET_POST_TYPE_FILTER',
		postType,
	};
} //end setPostTypeFilter()

export function receivePostsMatchingCriteria(
	criteria: FilterCriteria,
	posts: ReadonlyArray< Post >
): ReceivePostsMatchingCriteriaAction {
	return {
		type: 'RECEIVE_POSTS_MATCHING_CRITERIA',
		criteria,
		posts,
	};
} //end receivePostsMatchingCriteria()

export function markFilterCriteriaAsLoading(
	criteria: FilterCriteria,
	isLoading: boolean
): MarkFilterCriteriaAsLoadingAction {
	return {
		type: 'MARK_FILTER_CRITERIA_AS_LOADING',
		criteria,
		isLoading,
	};
} //end markFilterCriteriaAsLoading()

export function updateFilterCriteriaPagination(
	criteria: FilterCriteria,
	pagination: PaginationInfo
): UpdateFilterCriteriaPaginationAction {
	return {
		type: 'UPDATE_FILTER_CRITERIA_PAGINATION',
		criteria,
		pagination,
	};
} //end updateFilterCriteriaPagination()

// ============
// HELPER TYPES
// ============

type SortByAction = {
	readonly type: 'SORT_BY';
	readonly criterion: SortCriterion;
};

type SetPeriodFilterAction = {
	readonly type: 'SET_PERIOD_FILTER';
	readonly mode: PeriodMode;
	readonly value: PeriodValue;
};

type SetAuthorFilterAction = {
	readonly type: 'SET_AUTHOR_FILTER';
	readonly author: Maybe< AuthorId >;
};

type SetPostTypeFilterAction = {
	readonly type: 'SET_POST_TYPE_FILTER';
	readonly postType: Maybe< PostTypeName >;
};

type ReceivePostsMatchingCriteriaAction = {
	readonly type: 'RECEIVE_POSTS_MATCHING_CRITERIA';
	readonly criteria: FilterCriteria;
	readonly posts: ReadonlyArray< Post >;
};

type MarkFilterCriteriaAsLoadingAction = {
	readonly type: 'MARK_FILTER_CRITERIA_AS_LOADING';
	readonly criteria: FilterCriteria;
	readonly isLoading: boolean;
};

type UpdateFilterCriteriaPaginationAction = {
	readonly type: 'UPDATE_FILTER_CRITERIA_PAGINATION';
	readonly criteria: FilterCriteria;
	readonly pagination: PaginationInfo;
};
