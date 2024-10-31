/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { SocialTemplateAvailability, Weekday } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { PositiveDaysSelector } from './positive-days-selector';
import { DefaultSelector } from './default-selector';
import { WeekDaysSelector } from './week-days-selector';

export type DateSelectorProps = {
	readonly templateType: 'publication' | 'reshare';
	readonly availability: SocialTemplateAvailability;
	readonly setAvailability: ( value: SocialTemplateAvailability ) => void;
};

export const DateSelector = ( {
	templateType,
	availability,
	setAvailability,
}: DateSelectorProps ): JSX.Element | null => {
	const [ isSelectPositiveDays, setIsSelectPositiveDays ] = useState(
		availability.type === 'after-publication' &&
			! isPredefinedOffset( availability.daysAfterPublication )
	);
	const daysAfterPublication = useDaysAfterPublication( availability );
	const weekDays = useWeekdays( availability );

	if ( templateType === 'reshare' || availability.type === 'reshare' ) {
		return (
			<WeekDaysSelector
				days={ weekDays }
				onChange={ ( days: Record< Weekday, boolean > ) =>
					setAvailability( {
						...availability,
						...( hasWeekday( availability ) && {
							weekday: { ...days },
						} ),
					} )
				}
			/>
		);
	} //end if

	if (
		availability.type === 'after-publication' &&
		( ! isPredefinedOffset( availability.daysAfterPublication ) ||
			isSelectPositiveDays )
	) {
		return (
			<PositiveDaysSelector
				value={ availability.daysAfterPublication }
				onChange={ ( value ) =>
					setAvailability( {
						...availability,
						type: 'after-publication',
						daysAfterPublication: value,
					} )
				}
				resetSelector={ () => {
					setAvailability( {
						type: 'publication-day-offset',
						hoursAfterPublication: 0,
					} );
					setIsSelectPositiveDays( false );
				} }
			/>
		);
	}

	return (
		<DefaultSelector
			daysAfterPublication={ daysAfterPublication }
			onChange={ ( selection ) => {
				if ( 0 === selection ) {
					setAvailability( {
						...availability,
						type: 'publication-day-offset',
						hoursAfterPublication:
							availability.type === 'publication-day-offset'
								? availability.hoursAfterPublication
								: 0,
					} );
				} else if ( 'positive-days' === selection ) {
					setAvailability( {
						...availability,
						type: 'after-publication',
						daysAfterPublication: 2,
						time:
							availability.type === 'after-publication'
								? availability.time
								: 'morning',
					} );
					setIsSelectPositiveDays( true );
				} else {
					setAvailability( {
						...availability,
						type: 'after-publication',
						daysAfterPublication: selection,
						time:
							availability.type === 'after-publication'
								? availability.time
								: 'morning',
					} );
				} //end if
			} }
		/>
	);
};

// =====
// HOOKS
// =====

const useDaysAfterPublication = (
	availability: SocialTemplateAvailability
): number => {
	const { type } = availability;

	if ( type !== 'after-publication' ) {
		return 0;
	} //end if

	return availability.daysAfterPublication;
};

const useWeekdays = (
	availability: SocialTemplateAvailability
): Record< Weekday, boolean > => {
	if ( availability.type === 'reshare' ) {
		return availability.weekday;
	}

	return {
		mon: false,
		tue: false,
		wed: false,
		thu: false,
		fri: false,
		sat: false,
		sun: false,
	};
};

// =======
// HELPERS
// =======

function hasWeekday( availability: SocialTemplateAvailability ) {
	const { type } = availability;
	switch ( type ) {
		case 'publication-day-offset':
		case 'after-publication':
		case 'publication-day-period':
			return false;

		case 'reshare':
			return true;
	} //end switch
} //hasWeekday()

function isPredefinedOffset( value: number ) {
	return [ 0, 1, 7, 28 ].includes( value );
} //end isPredefinedOffset()
