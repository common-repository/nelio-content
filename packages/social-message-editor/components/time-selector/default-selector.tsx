/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useTime, useIsPostBasedSchedule } from '../../hooks';

export type DefaultSelectorProps = {
	readonly disabled?: boolean;
};

export const DefaultSelector = ( {
	disabled,
}: DefaultSelectorProps ): JSX.Element => {
	const [ { timeValue }, setTimeTypeAndValue ] = useTime();
	const isBasedOnPublication = useIsPostBasedSchedule();

	return (
		<BaseControl
			id="nelio-content-social-message-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__time-selector">
				<SelectControl
					disabled={ disabled }
					options={
						isBasedOnPublication
							? optionsFromPublication
							: optionsFromNow
					}
					value={ timeValue }
					onChange={ ( selection ) => {
						if (
							'positive-hours' === selection ||
							'exact' === selection
						) {
							setTimeTypeAndValue( selection, '' );
						} else {
							setTimeTypeAndValue(
								'predefined-offset',
								selection
							);
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

const optionsFromNow = [
	{ value: '0', label: _x( 'Now', 'text', 'nelio-content' ) },
	{ value: '1', label: _x( 'In one hour', 'text', 'nelio-content' ) },
	{ value: '3', label: _x( 'In three hours', 'text', 'nelio-content' ) },
	{ value: '5', label: _x( 'In five hours', 'text', 'nelio-content' ) },
	{
		value: 'positive-hours',
		label: _x( 'In __ hours', 'text', 'nelio-content' ),
	},
	{
		value: 'exact',
		label: _x( 'Choose a custom time…', 'user', 'nelio-content' ),
	},
];

const optionsFromPublication = [
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
		value: 'exact',
		label: _x( 'Choose a custom time…', 'user', 'nelio-content' ),
	},
];
