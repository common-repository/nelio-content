/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import moment from 'moment';
import { DateInput } from '@nelio-content/components';
import { useUtcNow, useToday } from '@nelio-content/data';
import { date } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import type {
	PeriodMode,
	State,
} from '~/nelio-content-pages/analytics/store/types';

export type DateSelectorProps = {
	readonly mode: PeriodMode;
	readonly from: string;
	readonly to: string;
	readonly onChange: ( v: State[ 'filters' ][ 'period' ] ) => void;
};

export const DateSelector = ( {
	mode,
	from,
	to,
	onChange,
}: DateSelectorProps ): JSX.Element => {
	const now = useUtcNow();
	const today = useToday();

	if ( 'custom' === mode ) {
		return (
			<div style={ { alignItems: 'center', display: 'flex' } }>
				<DateInput
					value={ from }
					max={ today }
					onChange={ ( newFrom = '' ) => {
						let newTo = '';
						if ( newFrom < to ) {
							newTo = to;
						} //end if
						if ( newFrom === today ) {
							newTo = today;
						} //end if
						onChange( {
							mode,
							value: {
								from: newFrom,
								to: newTo,
							},
						} );
					} }
				/>
				<DateInput
					value={ to }
					min={ from }
					max={ today }
					onChange={ ( newTo = '' ) => {
						onChange( {
							mode,
							value: {
								from,
								to: from && from > newTo ? '' : newTo,
							},
						} );
					} }
				/>
				<Button
					variant="link"
					onClick={ () =>
						onChange( {
							mode: 'all-time',
							value: { from: '', to: '' },
						} )
					}
				>
					<span className="screen-reader-text">
						{ _x( 'Back', 'command', 'nelio-content' ) }
					</span>
					<Dashicon icon="undo" />
				</Button>
			</div>
		);
	} //end if

	return (
		<SelectControl
			options={ OPTIONS }
			value={ mode }
			onChange={ ( value: PeriodMode ) => {
				switch ( value ) {
					case 'month-to-date':
						return onChange( {
							mode: value,
							value: {
								from: date( 'Y-m', now ) + '-01',
								to: date( 'Y-m-d', now ),
							},
						} );

					case 'last-30-days':
						return onChange( {
							mode: value,
							value: {
								from: date(
									'Y-m-d',
									moment( now ).add( -30, 'days' )
								),
								to: date( 'Y-m-d', now ),
							},
						} );

					case 'year-to-date':
						return onChange( {
							mode: value,
							value: {
								from: date( 'Y', now ) + '-01-01',
								to: date( 'Y-m-d', now ),
							},
						} );

					case 'last-12-months':
						return onChange( {
							mode: value,
							value: {
								from: date(
									'Y-m-d',
									moment( now ).add( -12, 'months' )
								),
								to: date( 'Y-m-d', now ),
							},
						} );

					case 'custom':
						const newTo = to || now;
						return onChange( {
							mode: value,
							value: {
								from: date( 'Y', newTo ) + '-01-01',
								to: date( 'Y-m-d', newTo ),
							},
						} );

					default:
						return onChange( {
							mode: 'all-time',
							value: { from: '', to: '' },
						} );
				} //end switch
			} }
		/>
	);
};

// DATA

const OPTIONS: ReadonlyArray< {
	readonly value: PeriodMode;
	readonly label: string;
} > = [
	{
		value: 'all-time',
		label: _x( 'All Time', 'text', 'nelio-content' ),
	},
	{
		value: 'month-to-date',
		label: _x( 'Month to date', 'text', 'nelio-content' ),
	},
	{
		value: 'last-30-days',
		label: _x( 'Last 30 days', 'text', 'nelio-content' ),
	},
	{
		value: 'year-to-date',
		label: _x( 'Year to date', 'text', 'nelio-content' ),
	},
	{
		value: 'last-12-months',
		label: _x( 'Last 12 months', 'text', 'nelio-content' ),
	},
	{
		value: 'custom',
		label: _x( 'Custom Period', 'text', 'nelio-content' ),
	},
];
