/**
 * Internal dependencies
 */
import type { State as PageAttributes } from './config';

export type PagesAction = SetPageAttribute< keyof PageAttributes >;

export function setPageAttribute< Page extends keyof PageAttributes >(
	page: Page,
	value: PageAttributes[ Page ]
): SetPageAttribute< Page > {
	return {
		type: 'SET_PAGE_ATTRIBUTE',
		page,
		value,
	};
} //end setPageAttribute()

// ============
// HELPER TYPES
// ============

type SetPageAttribute< Page extends keyof PageAttributes > = {
	readonly type: 'SET_PAGE_ATTRIBUTE';
	readonly page: Page;
	readonly value: PageAttributes[ Page ];
};
