/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { TimeInterval } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { ResetButton } from './reset-button';

export type TimeIntervalSelectorProps = {
	readonly interval: Interval;
	readonly setIntervalValue: ( value: TimeInterval ) => void;
	readonly selectExactTime: () => void;
	readonly reset?: () => void;
};

export const TimeIntervalSelector = ( {
	interval,
	setIntervalValue,
	selectExactTime,
	reset,
}: TimeIntervalSelectorProps ): JSX.Element => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__time-selector">
				<SelectControl
					options={ intervals }
					value={ interval }
					onChange={ ( value ) =>
						'exact' === value
							? selectExactTime()
							: setIntervalValue( value )
					}
				/>
			</div>
			{ !! reset && <ResetButton onClick={ () => reset() } /> }
		</BaseControl>
	);
};

// =======
// HELPERS
// =======

type Interval = TimeInterval | 'exact';
type IntervalOption = {
	readonly value: Interval;
	readonly label: string;
};

const intervals: ReadonlyArray< IntervalOption > = [
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
