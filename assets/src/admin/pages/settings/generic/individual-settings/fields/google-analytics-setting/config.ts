/**
 * External dependencies
 */
import type { PostId } from '@nelio-content/types';

export const DEFAULT_ATTRS: Attrs = {
	disabled: false,
	refreshDisabled: false,
	isRefreshDialogOpen: false,
	isRefreshing: false,
	isRefreshingOver: false,
	isStartingRefresh: false,
	isValidating: false,
	refreshPeriod: 'month',
	refreshPostCount: 0,
	refreshPostIndex: 0,
	mode: 'init',
	error: false,
};

export type Attrs = {
	readonly disabled: boolean;
	readonly refreshDisabled: boolean;
	readonly isRefreshDialogOpen: boolean;
	readonly isRefreshing: boolean;
	readonly isRefreshingOver: boolean;
	readonly isStartingRefresh: boolean;
	readonly isValidating: boolean;
	readonly refreshPeriod: 'month' | 'year' | 'all';
	readonly refreshPostCount: number;
	readonly refreshPostIndex: number;
	readonly error: false | string;
	readonly mode:
		| 'init'
		| 'ga4-property-id'
		| 'awaiting-profile-selection'
		| 'checking-google-analytics';
};

export type SetAttrs = ( attrs: Partial< Attrs > ) => void;

// ============
// HELPER TYPES
// ============

export type GAResponse = {
	readonly items?: ReadonlyArray< {
		readonly webProperties: ReadonlyArray< {
			readonly id: string;
			readonly name: string;
			readonly profiles: ReadonlyArray< {
				readonly id: string;
				readonly name: string;
			} >;
		} >;
	} >;
};

export type PostAnalyticsResponse = {
	readonly ids: ReadonlyArray< PostId >;
	readonly more: boolean;
	readonly total: number;
	readonly ppp: number;
};
