/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useTime } from '../../hooks';

export type TimeIntervalSelectorProps = {
	readonly disabled?: boolean;
};

export const TimeIntervalSelector = ( {
	disabled,
}: TimeIntervalSelectorProps ): JSX.Element => {
	const [ { timeValue }, setTimeTypeAndValue ] = useTime();

	return (
		<BaseControl
			id="nelio-content-social-message-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__time-selector">
				<SelectControl
					disabled={ disabled }
					options={ intervals }
					value={ timeValue }
					onChange={ ( selection ) => {
						if ( 'exact' === selection ) {
							setTimeTypeAndValue( 'exact', '' );
						} else {
							setTimeTypeAndValue( 'time-interval', selection );
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

const intervals = [
	{
		value: 'morning' as const,
		label: _x( 'Morning (8am – 11am)', 'text', 'nelio-content' ),
	},
	{
		value: 'noon' as const,
		label: _x( 'Noon (11am – 3pm)', 'text', 'nelio-content' ),
	},
	{
		value: 'afternoon' as const,
		label: _x( 'Afternoon (3pm – 7pm)', 'text', 'nelio-content' ),
	},
	{
		value: 'night' as const,
		label: _x( 'Night (7pm – 11pm)', 'text', 'nelio-content' ),
	},
	{
		value: 'exact' as const,
		label: _x( 'Choose a custom time…', 'user', 'nelio-content' ),
	},
];
