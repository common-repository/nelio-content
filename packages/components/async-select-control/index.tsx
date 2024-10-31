/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { isArray } from 'lodash';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase, StylesConfig } from 'react-select';
import type { AsyncPaginateProps } from 'react-select-async-paginate';

/**
 * Internal dependencies
 */
import './style.scss';

const WORDPRESS_TEXT_COLOR = '#32373c';
const WORDPRESS_ACCENT_COLOR = '#007cba';

export const DEFAULT_STYLE: StylesConfig = {
	control: ( _, state ) => ( {
		...getControlBorder( state ),
		background: state.isDisabled ? '#f7f7f7' : '#fff',
		boxShadow: state.isFocused
			? `0 0 0 1px ${ WORDPRESS_ACCENT_COLOR }`
			: undefined,
		display: 'flex',
		flexDirection: 'row',
		fontSize: '14px',
		height: ! state.isMulti ? '26px' : undefined,
		margin: '1px',
		padding: '0 0.5em',
	} ),

	input: ( style ) => ( {
		...style,
		margin: '-3px 0',
	} ),

	clearIndicator: ( style ) => ( {
		...style,
		padding: '0',
	} ),

	placeholder: ( style ) => ( {
		...style,
		margin: '-3px 0',
	} ),

	groupHeading: ( style ) => ( {
		...style,
		padding: '1em',
	} ),

	loadingIndicator: () => ( {
		display: 'none',
	} ),

	indicatorSeparator: () => ( {
		display: 'none',
	} ),

	dropdownIndicator: ( _, state ) => ( {
		display: 'flex',
		color: state.isDisabled ? '#c1c4c7' : '#555',
	} ),

	menuPortal: ( style ) => {
		const margin = 14;
		const width = Math.min( document.body.clientWidth - 2 * margin, 300 );
		const sl: unknown = isArray( style.left )
			? style.left[ 0 ]
			: style.left;
		const styleLeft = numberify( sl );

		const overflowX = Math.abs(
			Math.min(
				0,
				document.body.clientWidth - ( styleLeft + width + 14 )
			)
		);
		const left = styleLeft - overflowX;

		return {
			...style,
			zIndex: '999999',
			width,
			left,
			right: left + width - margin,
		};
	},

	menu: ( style ) => ( {
		...style,
		borderRadius: 0,
	} ),

	option: ( style, state ) => ( {
		...style,
		...getOptionColor( state ),
		padding: '0.5em 1em',
	} ),
};

type AdditionalArgs = {
	readonly page: number;
};

export type AsyncSelectControlProps< OptionType > = {
	readonly className?: string;
	readonly disabled?: boolean;
} & Omit<
	AsyncPaginateProps<
		OptionType,
		GroupBase< OptionType >,
		AdditionalArgs,
		false
	>,
	'theme' | 'isDisabled' | 'className' | 'isMulti'
>;

export function AsyncSelectControl< OptionType >( {
	className = '',
	disabled,
	styles,
	...props
}: AsyncSelectControlProps< OptionType > ): JSX.Element {
	return (
		<AsyncPaginate
			className={ `nelio-content-async-select-control ${ className }` }
			isDisabled={ disabled }
			/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
			styles={ { ...DEFAULT_STYLE, ...styles } as any }
			menuPortalTarget={ document.body }
			theme={ ( theme ) => ( {
				...theme,
				spacing: {
					...theme.spacing,
					baseUnit: 0,
					controlHeight: 28,
				},
			} ) }
			{ ...props }
		/>
	);
} //end AsyncSelectControl()

// =======
// HELPERS
// =======

const getControlBorder = ( {
	isDisabled,
	isFocused,
}: Partial< {
	isDisabled: boolean;
	isFocused: boolean;
} > = {} ) => {
	let color = '#7e8993';

	if ( isFocused ) {
		color = WORDPRESS_ACCENT_COLOR;
	} //end if

	if ( isDisabled ) {
		color = '#dddddd';
	} //end if

	return {
		border: `1px solid ${ color }`,
		borderRadius: '3px',
	};
};

const getOptionColor = ( {
	isSelected,
	isFocused,
}: Partial< {
	isSelected: boolean;
	isFocused: boolean;
} > = {} ) => {
	let color = WORDPRESS_TEXT_COLOR;
	let background = '#fff';

	if ( isSelected ) {
		background = '#f1f1f1';
	} //end if

	if ( isFocused ) {
		color = '#fff';
		background = WORDPRESS_ACCENT_COLOR;
	} //end if

	return { background, color };
};

const numberify = ( x: unknown ): number => {
	if ( 'number' === typeof x ) {
		return x;
	} //end if
	return 'string' === typeof x ? Number.parseInt( x ) || 0 : 0;
};
