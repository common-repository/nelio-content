/**
 * WordPress dependencies
 */
import { addFilter } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import type { PostId, PremiumItemType } from '@nelio-content/types';
import { pascalCase } from '@nelio-content/utils';

export function onLoadPremiumItemsRelatedToPost(
	typeName: PremiumItemType,
	callback: ( postId: PostId ) => Promise< void >
): void {
	addFilter(
		'nelio-content_data_loadPremiumItemsRelatedToPost',
		`loadPremium${ pascalCase( typeName ) }sRelatedToPost`,
		( (
			promises: ReadonlyArray< Promise< void > >,
			postId: PostId
		): ReadonlyArray< Promise< void > > => [
			...promises,
			callback( postId ),
		] ) as ( ...args: unknown[] ) => void
	);
} //end onLoadPremiumItemsRelatedToPost()

export function onLoadPremiumItemsInPeriod(
	typeName: PremiumItemType,
	callback: ( from: string, to: string ) => Promise< void >
): void {
	addFilter(
		'nelio-content_data_loadPremiumItemsInPeriod',
		`loadPremium${ pascalCase( typeName ) }sInPeriod`,
		( (
			promises: ReadonlyArray< Promise< void > >,
			from: string,
			to: string
		): ReadonlyArray< Promise< void > > => [
			...promises,
			callback( from, to ),
		] ) as ( ...args: unknown[] ) => void
	);
} //end onLoadPremiumItemsInPeriod()
