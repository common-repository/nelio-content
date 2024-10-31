/**
 * External dependencies
 */
import type {
	DraggableItemSummary,
	ItemSummary,
	Maybe,
} from '@nelio-content/types';

export type State = {
	readonly drag: Maybe< DraggableItemSummary >;
	readonly hover: Maybe< ItemSummary >;
};

export const INIT_STATE: State = {
	drag: undefined,
	hover: undefined,
};
