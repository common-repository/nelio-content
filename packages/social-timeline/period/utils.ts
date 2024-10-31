/**
 * External dependencies
 */
import type { Moment } from 'moment';
import type { SocialMessage, TimelinePeriod } from '@nelio-content/types';

export const filterUsingDate =
	( period: TimelinePeriod, baseMoment: Moment ) =>
	( { schedule }: SocialMessage ): boolean => {
		const diff = Math.abs( baseMoment.diff( schedule, 'days' ) );
		return isDiffInPeriod( period, diff );
	};

export const filterUsingOffset =
	( period: TimelinePeriod ) =>
	( message: SocialMessage ): boolean => {
		const { dateType, dateValue } = message;
		if ( 'exact' === dateType ) {
			return 'other' === period;
		} //end if

		const diff = Math.abs( Number.parseInt( dateValue ) || 0 );
		return isDiffInPeriod( period, diff );
	};

export const getDateTimeAttrs = (
	period: TimelinePeriod
): Partial<
	Pick< SocialMessage, 'dateType' | 'dateValue' | 'timeType' | 'timeValue' >
> => {
	switch ( period ) {
		case 'day':
			return {
				dateType: 'predefined-offset',
				dateValue: '0',
			};

		case 'week':
			return {
				dateType: 'predefined-offset',
				dateValue: '7',
				timeType: 'time-interval',
				timeValue: 'morning',
			};

		case 'month':
			return {
				dateType: 'predefined-offset',
				dateValue: '28',
				timeType: 'time-interval',
				timeValue: 'morning',
			};

		default:
			return {
				dateType: 'exact',
				timeType: 'time-interval',
				timeValue: 'morning',
			};
	} //end switch
};

// =======
// HELPERS
// =======

const isDiffInPeriod = ( period: TimelinePeriod, diff: number ) => {
	switch ( period ) {
		case 'day':
			return diff < 1;

		case 'week':
			return 1 <= diff && diff <= 10;

		case 'month':
			return 10 < diff && diff <= 40;

		default:
			return 40 < diff;
	} //end switch
};
