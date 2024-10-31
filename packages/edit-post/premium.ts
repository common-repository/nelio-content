/**
 * WordPress dependencies
 */
import { addFilter } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import type { PremiumItems, PremiumItemType } from '@nelio-content/types';
import { pascalCase } from '@nelio-content/utils';

export function onDeletePremiumItem< Type extends PremiumItemType >(
	typeName: Type,
	callback: ( item: PremiumItems[ Type ] ) => Promise< void >
): void {
	addFilter(
		'nelio-content_edit-post_onDeletePremiumItem',
		`deletePremium${ pascalCase( typeName ) }`,
		( (
			result: Promise< void >,
			actualTypeName: Type,
			item: PremiumItems[ Type ]
		): Promise< void > =>
			actualTypeName === typeName ? callback( item ) : result ) as (
			...args: unknown[]
		) => void
	);
} //end onDeletePremiumItem()
