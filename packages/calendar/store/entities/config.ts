/**
 * Internal dependencies
 */
import type { Timeout } from '../types';

export type State = {
	readonly unscheduledPosts: {
		readonly byQueryPagination: Record< string, PaginationInfo >;
		readonly defaultPagination: PaginationInfo;
		readonly query: string;
		readonly searchTimeout: Timeout;
	};
};

export const INIT_STATE: State = {
	unscheduledPosts: {
		byQueryPagination: {},
		defaultPagination: {
			lastPageLoaded: 0,
			maxPages: 1,
			isLoading: false,
		},
		query: '',
		searchTimeout: 0,
	},
};

// ============
// HELPER TYPES
// ============

export type PaginationInfo = {
	readonly lastPageLoaded: number;
	readonly maxPages: number;
	readonly isLoading: boolean;
};
