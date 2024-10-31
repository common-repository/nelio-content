/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import Select from 'react-select';
import type { Props as SelectProps, StylesConfig } from 'react-select';

/**
 * Internal dependencies
 */
import './style.scss';

import { DEFAULT_STYLE as BASIC_STYLE } from '../async-select-control';

const DEFAULT_STYLE: StylesConfig = {
	...BASIC_STYLE,
	valueContainer: ( style, state ) => ( {
		...style,
		...BASIC_STYLE.valueContainer?.( style, state ),
		padding: 0,
		marginTop: '-2px',
		marginBottom: '-2px',
	} ),
	input: ( style, state ) => ( {
		...style,
		...BASIC_STYLE.input?.( style, state ),
		margin: 0,
	} ),
};

export type StylizedSelectControlProps<
	OptionType,
	IsMulti extends boolean,
> = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly isMandatory?: boolean;
} & Omit<
	SelectProps< OptionType, IsMulti >,
	'isDisabled' | 'menuPortalTarget'
>;

export function StylizedSelectControl< OptionType, IsMulti extends boolean >( {
	className = '',
	disabled,
	styles = {},
	isMandatory,
	value,
	isMulti,
	...props
}: StylizedSelectControlProps< OptionType, IsMulti > ): JSX.Element {
	const isClearable =
		isMandatory && isMultiValue( value, isMulti ) ? value.length > 1 : true;
	return (
		<Select
			className={ `nelio-content-stylized-select-control ${ className }` }
			styles={
				{
					...DEFAULT_STYLE,
					multiValue: ( style, state ) =>
						isClearable
							? style
							: {
									...style,
									...DEFAULT_STYLE.multiValue?.(
										style,
										state
									),
									paddingRight: '3px',
							  },
					multiValueRemove: ( style, state ) =>
						isClearable
							? style
							: {
									...style,
									...DEFAULT_STYLE.multiValueRemove?.(
										style,
										state
									),
									display: 'none',
							  },
					valueContainer: ( style, state ) =>
						! isMulti
							? style
							: {
									...style,
									...DEFAULT_STYLE.valueContainer?.(
										style,
										state
									),
									marginLeft: '-5px',
							  },
					...styles,
				} as StylesConfig as StylesConfig< OptionType, IsMulti >
			}
			isClearable={ isClearable }
			isDisabled={ disabled }
			menuPortalTarget={ document.body }
			value={ value }
			isMulti={ isMulti }
			{ ...props }
		></Select>
	);
} //end StylizedSelectControl()

// =======
// HELPERS
// =======

const isMultiValue = ( x: unknown, isMulti?: boolean ): x is unknown[] =>
	!! isMulti && !! x && Array.isArray( x );
