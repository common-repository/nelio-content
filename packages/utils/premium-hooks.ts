/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import type {
	Maybe,
	PremiumItem,
	PremiumItems,
	PremiumItemSummary,
	PremiumItemType,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { pascalCase } from './strings';

// ----------------------------
// Create premium item summary
// ----------------------------

export function createPremiumItemSummary(
	type: PremiumItemType,
	item: PremiumItem
): Maybe< PremiumItemSummary > {
	return applyFilters(
		'nelio-content_utils_createPremiumItemSummary',
		undefined,
		type,
		item
	) as Maybe< PremiumItemSummary >;
} //end createPremiumItemSummary()

export function onCreatePremiumItemSummary< TName extends PremiumItemType >(
	typeName: TName,
	callback: (
		summary: Maybe< PremiumItemSummary >,
		item: PremiumItems[ TName ]
	) => Maybe< PremiumItemSummary >
): void {
	addFilter(
		'nelio-content_utils_createPremiumItemSummary',
		`createPremium${ pascalCase( typeName ) }Summary`,
		( (
			summary: Maybe< PremiumItemSummary >,
			actualTypeName: PremiumItemType,
			item: PremiumItem
		) =>
			typeName === actualTypeName
				? callback( summary, item as PremiumItems[ TName ] )
				: summary ) as ( ...args: unknown[] ) => void
	);
} //end onCreatePremiumItemSummary()
