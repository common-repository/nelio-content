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
	readonly value: number;
	readonly setValue: ( value: number ) => void;
	readonly selectPositiveHours: () => void;
	readonly selectExactTime: () => void;
	readonly selectTimeInterval: () => void;
};

export const DefaultSelector = ( {
	value,
	setValue,
	selectExactTime,
	selectPositiveHours,
	selectTimeInterval,
}: DefaultSelectorProps ): JSX.Element => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__time-selector">
				<SelectControl
					options={ options }
					value={ `${ value }` }
					onChange={ ( selection: Value ) => {
						if ( 'positive-hours' === selection ) {
							selectPositiveHours();
						} else if ( 'exact' === selection ) {
							selectExactTime();
						} else if ( 'time-interval' === selection ) {
							selectTimeInterval();
						} else {
							setValue( parseInt( selection ) );
						} //end if
					} }
				/>
			</div>
		</BaseControl>
	);
};

// =======
// HELPERS
// =======
type Value =
	| '0'
	| '1'
	| '3'
	| '5'
	| 'positive-hours'
	| 'exact'
	| 'time-interval';
type Option = {
	readonly value: Value;
	readonly label: string;
};
const options: ReadonlyArray< Option > = [
	{
		value: '0',
		label: _x( 'Same time as publication', 'text', 'nelio-content' ),
	},
	{
		value: '1',
		label: _x( 'One hour after publication', 'text', 'nelio-content' ),
	},
	{
		value: '3',
		label: _x( 'Three hours after publication', 'text', 'nelio-content' ),
	},
	{
		value: '5',
		label: _x( 'Five hours after publication', 'text', 'nelio-content' ),
	},
	{
		value: 'positive-hours',
		label: _x( '__ hours after publication', 'text', 'nelio-content' ),
	},
	{
		value: 'time-interval',
		label: _x( 'Choose a time interval…', 'user', 'nelio-content' ),
	},
	{
		value: 'exact',
		label: _x( 'Choose a custom time…', 'user', 'nelio-content' ),
	},
];
