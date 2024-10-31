/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type {
	ExactTime,
	SocialTemplateAvailability,
	TimeInterval,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { ExactTimeSelector } from './exact-selector';
import { PositiveHoursSelector } from './positive-hours-selector';
import { TimeIntervalSelector } from './time-interval-selector';
import { DefaultSelector } from './default-selector';

export type TimeSelectorProps = {
	readonly templateType: 'publication' | 'reshare';
	readonly availability: SocialTemplateAvailability;
	readonly setAvailability: ( value: SocialTemplateAvailability ) => void;
};

export const TimeSelector = ( {
	templateType,
	availability,
	setAvailability,
}: TimeSelectorProps ): JSX.Element | null => {
	const [ isCustomOffset, markAsCustomOffset ] = useState(
		availability.type === 'publication-day-offset' &&
			! isPredefinedOffset( availability.hoursAfterPublication )
	);
	const timeType = useTimeType( templateType, isCustomOffset, availability );
	const timeValue = useTimeValue( availability );

	if (
		timeType === 'exact' ||
		( timeType === 'time-interval' && isExactTime( timeValue ) )
	) {
		return (
			<ExactTimeSelector
				exactTime={ isExactTime( timeValue ) ? timeValue : '10:00' }
				setExactTime={ ( value ) =>
					setAvailability( {
						...availability,
						...( hasTime( availability ) && { time: value } ),
					} )
				}
				reset={ () =>
					setAvailability(
						availability.type === 'publication-day-period'
							? {
									type: 'publication-day-offset',
									hoursAfterPublication: 0,
							  }
							: {
									...availability,
									...( hasTime( availability ) && {
										time: 'morning',
									} ),
							  }
					)
				}
			/>
		);
	} //end if

	if ( timeType === 'positive-hours' ) {
		return (
			<PositiveHoursSelector
				hours={ typeof timeValue === 'number' ? timeValue : 2 }
				setHours={ ( value ) =>
					setAvailability( {
						type: 'publication-day-offset',
						hoursAfterPublication: value,
					} )
				}
				reset={ () => {
					setAvailability( {
						...availability,
						...( hasHoursAfterPublication( availability ) && {
							hoursAfterPublication: 0,
						} ),
					} );
					markAsCustomOffset( false );
				} }
			/>
		);
	} //end if

	if ( timeType === 'time-interval' ) {
		return (
			<TimeIntervalSelector
				interval={
					typeof timeValue !== 'number' && isTimeInterval( timeValue )
						? timeValue
						: 'morning'
				}
				setIntervalValue={ ( interval ) =>
					setAvailability( {
						...availability,
						...( hasTime( availability ) && {
							time: interval,
						} ),
					} )
				}
				selectExactTime={ () =>
					setAvailability( {
						...availability,
						...( hasTime( availability ) && {
							time: '10:00',
						} ),
					} )
				}
				reset={
					availability.type === 'publication-day-period'
						? () =>
								setAvailability( {
									type: 'publication-day-offset',
									hoursAfterPublication: 0,
								} )
						: undefined
				}
			/>
		);
	} //end if

	if ( timeType === 'predefined-offset' ) {
		return (
			<DefaultSelector
				value={
					availability.type === 'publication-day-offset' &&
					isPredefinedOffset( availability.hoursAfterPublication )
						? availability.hoursAfterPublication
						: 0
				}
				setValue={ ( value ) => {
					markAsCustomOffset( false );
					setAvailability( {
						...availability,
						...( hasHoursAfterPublication( availability ) && {
							hoursAfterPublication: value,
						} ),
					} );
				} }
				selectExactTime={ () => {
					markAsCustomOffset( false );
					setAvailability( {
						type: 'publication-day-period',
						time: '10:00',
					} );
				} }
				selectTimeInterval={ () => {
					markAsCustomOffset( false );
					setAvailability( {
						type: 'publication-day-period',
						time: 'morning',
					} );
				} }
				selectPositiveHours={ () => {
					markAsCustomOffset( true );
					setAvailability( {
						...availability,
						...( hasHoursAfterPublication( availability ) && {
							hoursAfterPublication: 2,
						} ),
					} );
				} }
			/>
		);
	} //end if

	return null;
};

// =====
// HOOKS
// =====

type TimeType =
	| 'exact'
	| 'positive-hours'
	| 'time-interval'
	| 'predefined-offset';

const useTimeType = (
	templateType: 'publication' | 'reshare',
	isCustomOffset: boolean,
	availability: SocialTemplateAvailability
): TimeType => {
	const { type } = availability;

	if ( templateType === 'reshare' ) {
		return 'time-interval';
	} //end if

	switch ( type ) {
		case 'publication-day-offset':
			if ( ! availability.hoursAfterPublication ) {
				return 'predefined-offset';
			} //end if

			return isCustomOffset ||
				! isPredefinedOffset( availability.hoursAfterPublication )
				? 'positive-hours'
				: 'predefined-offset';

		case 'after-publication':
		case 'publication-day-period':
		case 'reshare':
			return isTimeInterval( availability.time )
				? 'time-interval'
				: 'exact';
	} //end switch
};

type TimeValue = number | TimeInterval | ExactTime;

const useTimeValue = (
	availability: SocialTemplateAvailability
): TimeValue => {
	const { type } = availability;
	switch ( type ) {
		case 'publication-day-offset':
			return availability.hoursAfterPublication;

		case 'after-publication':
		case 'publication-day-period':
		case 'reshare':
			return availability.time;
	}
};

// =======
// HELPERS
// =======

function hasTime( availability: SocialTemplateAvailability ) {
	const { type } = availability;
	switch ( type ) {
		case 'publication-day-offset':
			return false;

		case 'after-publication':
		case 'publication-day-period':
		case 'reshare':
			return true;
	}
}

function hasHoursAfterPublication( availability: SocialTemplateAvailability ) {
	return availability.type === 'publication-day-offset';
} //end hasHoursAfterPublication()

function isPredefinedOffset( value: number ) {
	return [ 0, 1, 3, 5 ].includes( value );
} //end isPredefinedOffset()

function isTimeInterval( time: string ): time is TimeInterval {
	return ! time.includes( ':' );
} //end isTimeInterval()

function isExactTime( time: TimeValue ): time is ExactTime {
	return typeof time === 'string' && ! isTimeInterval( time );
} //end isExactTime()
