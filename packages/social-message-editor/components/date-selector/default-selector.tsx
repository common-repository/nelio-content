/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDate, useIsPostBasedSchedule } from '../../hooks';

export type DefaultSelectorProps = {
	readonly disabled?: boolean;
};

export const DefaultSelector = ( {
	disabled,
}: DefaultSelectorProps ): JSX.Element => {
	const [ { dateValue }, setDateTypeAndValue ] = useDate();
	const isBasedOnPublication = useIsPostBasedSchedule();

	return (
		<BaseControl
			id="nelio-content-social-message-editor__date-selector"
			label={ _x( 'Date', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__date-selector">
				<SelectControl
					disabled={ disabled }
					options={
						isBasedOnPublication
							? optionsFromPublication
							: optionsFromNow
					}
					value={ dateValue ?? '' }
					onChange={ ( selection ) => {
						if (
							'positive-days' === selection ||
							'exact' === selection
						) {
							setDateTypeAndValue( selection, '' );
						} else {
							setDateTypeAndValue(
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
	{ value: '0', label: _x( 'Today', 'text', 'nelio-content' ) },
	{ value: '1', label: _x( 'Tomorrow', 'text', 'nelio-content' ) },
	{ value: '7', label: _x( 'Next week', 'text', 'nelio-content' ) },
	{ value: '28', label: _x( 'Next month', 'text', 'nelio-content' ) },
	{
		value: 'positive-days',
		label: _x( 'In __ days', 'text', 'nelio-content' ),
	},
	{
		value: 'exact',
		label: _x( 'Choose a custom date…', 'user', 'nelio-content' ),
	},
];

const optionsFromPublication = [
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
	{
		value: 'exact',
		label: _x( 'Choose a custom date…', 'user', 'nelio-content' ),
	},
];
