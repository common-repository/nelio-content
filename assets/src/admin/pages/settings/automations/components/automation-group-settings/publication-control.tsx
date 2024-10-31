/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { AutomationGroup } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

const PUBLICATION_OPTIONS = [
	{
		value: 'always' as const,
		label: _x( 'Any date', 'text', 'nelio-content' ),
	},
	{
		value: '30' as const,
		label: _x( 'Last month', 'text', 'nelio-content' ),
	},
	{
		value: '60' as const,
		label: _x( 'Last two months', 'text', 'nelio-content' ),
	},
	{
		value: '90' as const,
		label: _x( 'Last three months', 'text', 'nelio-content' ),
	},
	{
		value: '180' as const,
		label: _x( 'Last six months', 'text', 'nelio-content' ),
	},
	{
		value: '365' as const,
		label: _x( 'Last year', 'text', 'nelio-content' ),
	},
];

type Unpack< T > = T extends Array< infer A > ? A : never;
type PublicationValue = Unpack< typeof PUBLICATION_OPTIONS >[ 'value' ];

export type PublicationControlProps = {
	readonly value: AutomationGroup[ 'publication' ];
	readonly onChange: (
		publication: AutomationGroup[ 'publication' ]
	) => void;
};

export const PublicationControl = ( {
	value,
	onChange,
}: PublicationControlProps ): JSX.Element => {
	const properValue = value.type === 'always' ? 'always' : `${ value.days }`;

	return (
		<SelectControl
			label={ _x( 'Publication date', 'text', 'nelio-content' ) }
			options={ PUBLICATION_OPTIONS }
			value={ properValue }
			onChange={ ( newValue: PublicationValue ) =>
				'always' === newValue
					? onChange( { type: 'always' } )
					: onChange( {
							type: 'max-age',
							days: parseInt( newValue ) || 30,
					  } )
			}
		/>
	);
};
