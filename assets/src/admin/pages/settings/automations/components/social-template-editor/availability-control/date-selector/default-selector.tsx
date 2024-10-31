/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */

export type DefaultSelectorProps = {
	readonly daysAfterPublication: number;
	readonly onChange: ( value: number | 'positive-days' ) => void;
};

export const DefaultSelector = ( {
	daysAfterPublication,
	onChange,
}: DefaultSelectorProps ): JSX.Element | null => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__date-selector"
			label={ _x( 'Date', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__date-selector">
				<SelectControl
					options={ optionsFromPublication }
					value={ `${ daysAfterPublication }` }
					onChange={ ( selection: Value ) =>
						selection === 'positive-days'
							? onChange( 'positive-days' )
							: onChange( parseInt( selection ) )
					}
				/>
			</div>
		</BaseControl>
	);
};

// =======
// HELPERS
// =======

type Value = '0' | '1' | '7' | '28' | 'positive-days';
type Option = {
	value: Value;
	label: string;
};
const optionsFromPublication: ReadonlyArray< Option > = [
	{
		value: '0',
		label: _x( 'Same day as publication', 'text', 'nelio-content' ),
	},
	{
		value: '1',
		label: _x( 'The day after publication', 'text', 'nelio-content' ),
	},
	{
		value: '7',
		label: _x( 'A week after publication', 'text', 'nelio-content' ),
	},
	{
		value: '28',
		label: _x( 'A month after publication', 'text', 'nelio-content' ),
	},
	{
		value: 'positive-days',
		label: _x( '__ days after publication', 'text', 'nelio-content' ),
	},
];
