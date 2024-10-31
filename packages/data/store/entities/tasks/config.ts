/**
 * External dependencies
 */
import type {
	PostId,
	EditorialTask,
	EditorialTaskSummary,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly byId: Record< Uuid, EditorialTask >;
	readonly byRelatedPost: Record<
		PostId,
		ReadonlyArray< EditorialTaskSummary >
	>;
};

export const INIT: State = {
	byId: {},
	byRelatedPost: {},
};
