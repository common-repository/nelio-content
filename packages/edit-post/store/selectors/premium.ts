/**
 * External dependencies
 */
import type { PremiumItemType, PremiumItems } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isPremiumItemBeingDeleted< Type extends PremiumItemType >(
	state: State,
	typeName: Type,
	itemId: PremiumItems[ Type ][ 'id' ]
): boolean {
	return !! state.premiumByType[ typeName ]?.deleting.includes( itemId );
} //end isPremiumItemBeingDeleted()
