/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { TaskTemplate } from '@nelio-content/types';

type DateType = Exclude< TaskTemplate[ 'dateType' ], 'predefined-offset' >;
type DateValue = TaskTemplate[ 'dateValue' ];

export type DefaultSelectorProps = {
	readonly dateValue: DateValue;
	readonly disabled?: boolean;
	readonly setDateType: ( type: DateType ) => void;
	readonly setDateValue: ( value: DateValue ) => void;
};

export const DefaultSelector = ( {
	dateValue,
	disabled,
	setDateType,
	setDateValue,
}: DefaultSelectorProps ): JSX.Element => (
	<SelectControl
		className="nelio-content-task-template-editor-date-due__default-select"
		disabled={ disabled }
		options={ OPTIONS }
		value={ dateValue }
		onChange={ ( value ) => {
			if ( isDateType( value ) ) {
				setDateType( value );
				setDateValue( '' );
			} else {
				setDateValue( value );
			} //end if
		} }
	/>
);

// =======
// HELPERS
// =======

type Option = {
	readonly value: '0' | '-1' | '-7' | DateType;
	readonly label: string;
};

const isDateType = ( x: Option[ 'value' ] ): x is DateType =>
	[ 'positive-days', 'negative-days' ].includes( x );

const OPTIONS: ReadonlyArray< Option > = [
	{
		value: '0',
		label: _x( 'Same day as publication', 'text', 'nelio-content' ),
	},
	{
		value: '-1',
		label: _x( 'The day before publication', 'text', 'nelio-content' ),
	},
	{
		value: '-7',
		label: _x( 'A week before publication', 'text', 'nelio-content' ),
	},
	{
		value: 'negative-days',
		label: _x( '__ days before publication', 'text', 'nelio-content' ),
	},
	{
		value: 'positive-days',
		label: _x( '__ days after publication', 'text', 'nelio-content' ),
	},
];
