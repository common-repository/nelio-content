/**
 * WordPress dependencies
 */
import { dispatch, select } from '@safe-wordpress/data';
import { applyFilters } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { PremiumItemType, PremiumItems } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store } from '../../../store';

export async function deletePremiumItem< Type extends PremiumItemType >(
	typeName: Type,
	itemId: PremiumItems[ Type ][ 'id' ]
): Promise< void > {
	const item = select( NC_DATA ).getPremiumItem( typeName, itemId );
	if ( ! item ) {
		return;
	} //end if

	await dispatch( store ).markPremiumItemAsDeleting( typeName, itemId, true );
	await applyFilters(
		'nelio-content_edit-post_onDeletePremiumItem',
		new Promise< void >( ( r ) => r() ),
		typeName,
		item
	);
	await dispatch( store ).markPremiumItemAsDeleting(
		typeName,
		itemId,
		false
	);
} //end deletePremiumItem()
