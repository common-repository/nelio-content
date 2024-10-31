/**
 * External dependencies
 */
import type {
	PostId,
	PremiumItemSummaries,
	PremiumItemType,
	PremiumItems,
} from '@nelio-content/types';

export type State = Partial< {
	readonly [ K in PremiumItemType ]: PremiumItemState< K >;
} >;

export type PremiumItemState< Type extends PremiumItemType > = {
	readonly byId: Record< PremiumItems[ Type ][ 'id' ], PremiumItems[ Type ] >;
	readonly byRelatedPost: Record<
		PostId,
		ReadonlyArray< PremiumItemSummaries[ Type ] >
	>;
};

export const INIT: State = {};
