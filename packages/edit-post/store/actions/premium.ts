/**
 * External dependencies
 */
import type { PremiumItemType, PremiumItems } from '@nelio-content/types';

export type PremiumAction = MarkPremiumItemAsDeleting< PremiumItemType >;

export function markPremiumItemAsDeleting< Type extends PremiumItemType >(
	typeName: Type,
	itemId: PremiumItems[ Type ][ 'id' ],
	isDeleting: boolean
): MarkPremiumItemAsDeleting< Type > {
	return {
		type: 'MARK_PREMIUM_ITEM_AS_DELETING',
		typeName,
		itemId,
		isDeleting,
	};
} //end markPremiumItemAsDeleting()

// ============
// HELPER TYPES
// ============

type MarkPremiumItemAsDeleting< Type extends PremiumItemType > = {
	readonly type: 'MARK_PREMIUM_ITEM_AS_DELETING';
	readonly typeName: Type;
	readonly itemId: PremiumItems[ Type ][ 'id' ];
	readonly isDeleting: boolean;
};
