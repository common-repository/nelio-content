/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { PremiumItems, PremiumItemType } from '@nelio-content/types';

export type PremiumItemAction =
	| ReceivePremiumItemsAction< PremiumItemType >
	| RemovePremiumItemAction< PremiumItemType >;

export function receivePremiumItems< Type extends PremiumItemType >(
	typeName: Type,
	items: PremiumItems[ Type ] | ReadonlyArray< PremiumItems[ Type ] >
): ReceivePremiumItemsAction< Type > {
	return {
		type: 'RECEIVE_PREMIUM_ITEMS',
		typeName,
		items: castArray( items ),
	};
} //end receivePremiumItems()

export function removePremiumItem< Type extends PremiumItemType >(
	typeName: Type,
	itemId: PremiumItems[ Type ][ 'id' ]
): RemovePremiumItemAction< Type > {
	return {
		type: 'REMOVE_PREMIUM_ITEM',
		typeName,
		itemId,
	};
} //end removePremiumItem()

// ============
// HELPER TYPES
// ============

type RemovePremiumItemAction< Type extends PremiumItemType > = {
	readonly type: 'REMOVE_PREMIUM_ITEM';
} & {
	readonly [ K in Type ]: {
		readonly typeName: K;
		readonly itemId: PremiumItems[ K ][ 'id' ];
	};
}[ Type ];

type ReceivePremiumItemsAction< Type extends PremiumItemType > = {
	readonly type: 'RECEIVE_PREMIUM_ITEMS';
} & {
	readonly [ K in Type ]: {
		readonly typeName: K;
		readonly items: ReadonlyArray< PremiumItems[ K ] >;
	};
}[ Type ];
