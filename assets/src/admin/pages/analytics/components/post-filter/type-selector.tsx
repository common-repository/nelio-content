/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { usePostTypes } from '@nelio-content/data';
import type { Maybe, PostTypeName } from '@nelio-content/types';

export type TypeSelectorProps = {
	readonly value: Maybe< PostTypeName >;
	readonly onChange: ( v: Maybe< PostTypeName > ) => void;
};

// TODO. This is not working as expected.
export const TypeSelector = ( {
	value,
	onChange,
}: TypeSelectorProps ): JSX.Element => {
	const postTypes = usePostTypes( 'analytics' );

	const OPTIONS = [
		{
			value: '__nc-all__' as const,
			label: _x( 'All Content', 'text', 'nelio-content' ),
		},
		...postTypes.map( ( pt ) => ( {
			value: pt.name,
			label: pt.labels.plural,
		} ) ),
	];

	return (
		<SelectControl
			options={ OPTIONS }
			value={ value }
			onChange={ ( v ) => onChange( '__nc-all__' === v ? undefined : v ) }
		/>
	);
};
