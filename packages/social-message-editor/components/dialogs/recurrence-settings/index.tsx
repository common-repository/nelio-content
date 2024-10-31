/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, SelectControl } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { range, without } from 'lodash';
import { NumberControl } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type {
	MonthlyRecurrenceSettings,
	RecurrenceSettings,
	Weekday,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useIsEditingRecurrenceSettings,
	useRecurrenceContext,
	useRecurrenceSettings,
} from '../../../hooks';

// TODO. Refactor to a constants package?
const MAX_OCCURRENCES = 50;

export const RecurrenceSettingsDialog = (): JSX.Element => {
	const [ context ] = useRecurrenceContext();
	const [ _, editRecurrenceSettings ] = useIsEditingRecurrenceSettings();
	const firstWeekday = useFirstWeekday();

	const [ settings, setSettings ] = useRecurrenceSettings();
	const setPeriod = ( period: RecurrenceSettings[ 'period' ] ) => {
		switch ( period ) {
			case 'day':
				return setSettings( {
					period,
					occurrences: settings.occurrences,
					interval: settings.interval,
				} );

			case 'week':
				return setSettings( {
					period,
					occurrences: settings.occurrences,
					interval: settings.interval,
					firstWeekday,
					weekdays: [ context.weekday ],
					isMessageDay: true,
				} );

			case 'month':
				return setSettings( {
					period,
					occurrences: settings.occurrences,
					interval: settings.interval,
					day: 'monthday',
				} );
		} //end switch
	};

	return (
		<Modal
			className="nelio-content-social-message-recurrence-settings-dialog"
			title={ _x(
				'Recurring Message Settings',
				'text',
				'nelio-content'
			) }
			isDismissible={ false }
			onRequestClose={ () => void null }
		>
			<div className="nelio-content-social-message-recurrence-settings-dialog__content">
				<div className="nelio-content-social-message-recurrence-settings-dialog__basic-settings">
					{ createInterpolateElement(
						sprintf(
							/* translators: 1 -> number selector, 2 -> days/weeks/months selector */
							_x(
								'Repeat every %1$s %2$s',
								'text',
								'nelio-content'
							),
							'<occurrences />',
							'<period />'
						),
						{
							occurrences: (
								<NumberControl
									value={
										! settings.interval
											? undefined
											: settings.interval
									}
									onChange={ ( interval = 0 ) =>
										setSettings( { ...settings, interval } )
									}
									min={ 1 }
								/>
							),
							period: (
								<SelectControl
									value={ settings.period }
									onChange={ setPeriod }
									options={ OPTIONS }
								/>
							),
						}
					) }
				</div>

				<WeeklyControls />
				<MonthlyControls />

				<div className="nelio-content-social-message-recurrence-settings-dialog__occurrences">
					{ createInterpolateElement(
						sprintf(
							/* translators: 1 -> number */
							_x(
								'Ends after %s occurrences',
								'text',
								'nelio-content'
							),
							'<occurrences />'
						),
						{
							occurrences: (
								<NumberControl
									value={
										settings.occurrences < 2
											? undefined
											: settings.occurrences
									}
									onChange={ ( occurrences = 0 ) =>
										setSettings( {
											...settings,
											occurrences,
										} )
									}
									min={ 2 }
									max={ MAX_OCCURRENCES }
								/>
							),
						}
					) }
				</div>
			</div>
			<div className="nelio-content-social-message-recurrence-settings-dialog__actions">
				<Button
					variant="primary"
					onClick={ () => editRecurrenceSettings( false ) }
					disabled={ areInvalid( settings ) }
				>
					{ _x( 'Back', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</Modal>
	);
};

// ============
// HELPER VIEWS
// ============

const WeeklyControls = () => {
	const [ context ] = useRecurrenceContext();
	const [ settings, setSettings ] = useRecurrenceSettings();
	const firstDayOfWeek = useSelect( ( select ) =>
		select( NC_DATA ).getFirstDayOfWeek()
	);

	if ( settings.period !== 'week' ) {
		return null;
	} //end if

	const toggleDay = ( day: Weekday, checked: boolean ) => {
		const weekdays = checked
			? [ ...settings.weekdays, day ]
			: without( settings.weekdays, day );

		const actualSettings = {
			...settings,
			weekdays,
			isMessageDay:
				weekdays.length === 1 && weekdays.includes( context.weekday ),
		};

		const defaultSettings = {
			...settings,
			weekdays: [ context.weekday ],
			isMessageDay: true,
		};

		const areAllDisabled = actualSettings.weekdays.length === 0;
		setSettings( areAllDisabled ? defaultSettings : actualSettings );
	};

	return (
		<div className="nelio-content-social-message-recurrence-settings-dialog__weekdays">
			<span>{ _x( 'On', 'text (on + weekdays)', 'nelio-content' ) }</span>
			{ range( 0, 7 )
				.map( ( i ) => WEEKDAYS[ ( i + firstDayOfWeek ) % 7 ] || 'sun' )
				.map( ( day, index ) => (
					<div
						key={ index }
						className="nelio-content-social-message-recurrence-settings-dialog__weekdays__toggle"
					>
						<input
							type="checkbox"
							checked={ settings.weekdays.includes( day ) }
							onChange={ ( ev ) =>
								toggleDay( day, ev.target.checked )
							}
						/>
						<span>{ WEEKDAY_SINGLE_LETTER[ day ] }</span>
					</div>
				) ) }
		</div>
	);
};

const MonthlyControls = () => {
	const [ context ] = useRecurrenceContext();
	const [ settings, setSettings ] = useRecurrenceSettings();

	if ( settings.period !== 'month' ) {
		return null;
	} //end if

	const getLabel = ( n: 1 | 2 | 3 | 4 | 5 ): string => {
		switch ( n ) {
			case 1:
				return sprintf(
					/* translators: day of week */
					_x( 'On the first %s', 'text', 'nelio-content' ),
					WEEKDAY_NAME[ context.weekday ]
				);

			case 2:
				return sprintf(
					/* translators: day of week */
					_x( 'On the second %s', 'text', 'nelio-content' ),
					WEEKDAY_NAME[ context.weekday ]
				);

			case 3:
				return sprintf(
					/* translators: day of week */
					_x( 'On the third %s', 'text', 'nelio-content' ),
					WEEKDAY_NAME[ context.weekday ]
				);

			case 4:
				return sprintf(
					/* translators: day of week */
					_x( 'On the fourth %s', 'text', 'nelio-content' ),
					WEEKDAY_NAME[ context.weekday ]
				);

			case 5:
				return sprintf(
					/* translators: day of week */
					_x( 'On the last %s', 'text', 'nelio-content' ),
					WEEKDAY_NAME[ context.weekday ]
				);
		} //end switch
	};

	const options: MonthlySelectOption[] = [
		{
			value: 'monthday',
			label: sprintf(
				/* translators: day number in month */
				_x( 'On day %d', 'text', 'nelio-content' ),
				context.monthday
			),
		},
		{
			value:
				context.weekindex[ 0 ] === 5 ? 'last-weekday' : 'nth-weekday',
			label: getLabel( context.weekindex[ 0 ] ),
		},
	];

	if ( context.weekindex[ 1 ] === 5 ) {
		options.push( {
			value: 'last-weekday',
			label: getLabel( 5 ),
		} );
	} //end if

	return (
		<SelectControl
			options={ options }
			value={ settings.day }
			onChange={ ( value ) => setSettings( { ...settings, day: value } ) }
		/>
	);
};

// =======
// HELPERS
// =======

type MonthlySelectOption = {
	readonly value: MonthlyRecurrenceSettings[ 'day' ];
	readonly label: string;
};

const useFirstWeekday = () =>
	useSelect(
		( select ): Weekday =>
			WEEKDAYS[ select( NC_DATA ).getFirstDayOfWeek() ] || 'sun'
	);

const OPTIONS_DICT: Record< RecurrenceSettings[ 'period' ], string > = {
	day: _x( 'Days', 'text', 'nelio-content' ),
	week: _x( 'Weeks', 'text', 'nelio-content' ),
	month: _x( 'Months', 'text', 'nelio-content' ),
};

const OPTIONS = Object.keys( OPTIONS_DICT )
	.map( ( value ) => value as RecurrenceSettings[ 'period' ] )
	.map( ( value ) => ( { value, label: OPTIONS_DICT[ value ] } ) );

const WEEKDAYS: ReadonlyArray< Weekday > = [
	'sun',
	'mon',
	'tue',
	'wed',
	'thu',
	'fri',
	'sat',
];

const WEEKDAY_NAME: Record< Weekday, string > = {
	sun: _x( 'Sunday', 'text', 'nelio-content' ),
	mon: _x( 'Monday', 'text', 'nelio-content' ),
	tue: _x( 'Tuesday', 'text', 'nelio-content' ),
	wed: _x( 'Wednesday', 'text', 'nelio-content' ),
	thu: _x( 'Thursday', 'text', 'nelio-content' ),
	fri: _x( 'Friday', 'text', 'nelio-content' ),
	sat: _x( 'Saturday', 'text', 'nelio-content' ),
};

const WEEKDAY_SINGLE_LETTER: Record< Weekday, string > = {
	sun: _x( 'S', 'text (sunday)', 'nelio-content' ),
	mon: _x( 'M', 'text (monday)', 'nelio-content' ),
	tue: _x( 'T', 'text (tuesday)', 'nelio-content' ),
	wed: _x( 'W', 'text (wednesday)', 'nelio-content' ),
	thu: _x( 'T', 'text (thursday)', 'nelio-content' ),
	fri: _x( 'F', 'text (friday)', 'nelio-content' ),
	sat: _x( 'S', 'text (saturday)', 'nelio-content' ),
};

const areInvalid = ( settings: RecurrenceSettings ): boolean =>
	settings.occurrences < 2 || settings.interval < 1;
