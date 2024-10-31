/**
 * External dependencies
 */
import type {
	AuthorId,
	Dict,
	Maybe,
	PostId,
	PostTypeName,
} from '@nelio-content/types';

export type State = {
	readonly sortBy: SortCriterion;

	readonly filters: {
		readonly author: Maybe< AuthorId >;
		readonly period: {
			readonly mode: PeriodMode;
			readonly value: PeriodValue;
		};
		readonly postType: Maybe< PostTypeName >;
	};

	readonly status: {
		readonly loading: ReadonlyArray< string >;
		readonly pagination: Dict< PaginationInfo >;
	};

	readonly postsByCriteria: Dict< ReadonlyArray< PostId > >;
};

export type FilterCriteria = {
	readonly sortBy: SortCriterion;
	readonly author: Maybe< AuthorId >;
	readonly postType: Maybe< PostTypeName >;
	readonly periodMode: PeriodMode;
	readonly periodValue: PeriodValue;
};

export type SortCriterion = 'pageviews' | 'engagement';

export type PeriodMode =
	| 'all-time'
	| 'month-to-date'
	| 'last-30-days'
	| 'year-to-date'
	| 'last-12-months'
	| 'custom';

export type PeriodValue = {
	readonly from: string;
	readonly to: string;
};

export type PaginationInfo = {
	readonly lastLoadedPage: number;
	readonly isFullyLoaded: boolean;
};
