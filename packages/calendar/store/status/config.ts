/**
 * External dependencies
 */
import type {
	EditorialTaskSummary,
	PostSummary,
	SocialMessageSummary,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Timeout } from '../types';

export type State = {
	readonly loadedDays: Record< string, true >;
	readonly loaderTimeout: Timeout;
	readonly updating: ReadonlyArray< UpdatingItemSummary | Period >;
};

export const INIT_STATE: State = {
	loadedDays: {},
	loaderTimeout: 0,
	updating: [],
};

// ============
// HELPER TYPES
// ============

export type Period = {
	readonly type: 'period';
	readonly id: string;
	readonly firstDay: string;
	readonly lastDay: string;
};

export type UpdatingItemSummary =
	| Pick< PostSummary, 'id' | 'type' | 'relatedPostId' >
	| Pick<
			SocialMessageSummary,
			'id' | 'type' | 'relatedPostId' | 'recurrenceGroup'
	  >
	| Pick< EditorialTaskSummary, 'id' | 'type' | 'relatedPostId' >;
