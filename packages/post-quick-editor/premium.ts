/**
 * WordPress dependencies
 */
import { addFilter } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import { pascalCase } from '@nelio-content/utils';
import type {
	PostId,
	PremiumItems,
	PremiumItemType,
} from '@nelio-content/types';

export function onSavePremiumItems< Type extends PremiumItemType >(
	typeName: Type,
	callback: (
		items: ReadonlyArray< PremiumItems[ Type ] >,
		postId: PostId
	) => Promise< ReadonlyArray< PremiumItems[ Type ] > >
): void {
	addFilter(
		'nelio-content_post-quick-editor_onSavePremiumItems',
		`save${ pascalCase( typeName ) }s`,
		( (
			defaultResult: Promise< ReadonlyArray< PremiumItems[ Type ] > >,
			actualTypeName: PremiumItemType,
			items: ReadonlyArray< PremiumItems[ Type ] >,
			postId: PostId
		): Promise< ReadonlyArray< PremiumItems[ Type ] > > =>
			typeName === actualTypeName
				? callback( items, postId )
				: defaultResult ) as ( ...args: unknown[] ) => void
	);
} //end onSavePremiumItems()
