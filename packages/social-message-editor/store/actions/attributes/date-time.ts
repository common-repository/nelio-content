/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../../store';

export type DateTimeAction =
	| SetDateTypeAndValueAction
	| SetTimeTypeAndValueAction;

export function setDateTypeAndValue(
	dateType: SocialMessage[ 'dateType' ],
	dateValue: SocialMessage[ 'dateValue' ]
): SetDateTypeAndValueAction {
	const oldDateTime: Datetime = {
		dateType: select( NC_SOCIAL_EDITOR ).getDateType(),
		dateValue: select( NC_SOCIAL_EDITOR ).getDateValue(),
		timeType: select( NC_SOCIAL_EDITOR ).getTimeType(),
		timeValue: select( NC_SOCIAL_EDITOR ).getTimeValue(),
	};

	const newDateTime: Datetime = {
		...oldDateTime,
		dateType,
		dateValue,
	};

	return {
		type: 'SET_DATE',
		...getProperDateTime( oldDateTime, newDateTime ),
	};
} //end setDateTypeAndValue()

export function setTimeTypeAndValue(
	timeType: SocialMessage[ 'timeType' ],
	timeValue: SocialMessage[ 'timeValue' ]
): SetTimeTypeAndValueAction {
	return {
		type: 'SET_TIME',
		timeType,
		timeValue,
	};
} //end setTimeTypeAndValue()

export function resetDateTime(): SetDateTypeAndValueAction {
	return setDateTypeAndValue( 'predefined-offset', '0' );
} //end resetDateTime()

export function resetTime(): SetTimeTypeAndValueAction {
	if ( select( NC_SOCIAL_EDITOR ).isEditingReusableMessage() ) {
		return setTimeTypeAndValue( 'time-interval', 'morning' );
	} //end if

	const dateType = select( NC_SOCIAL_EDITOR ).getDateType();
	const dateValue = select( NC_SOCIAL_EDITOR ).getDateValue();

	return 'predefined-offset' === dateType && '0' === dateValue
		? setTimeTypeAndValue( 'predefined-offset', '0' )
		: setTimeTypeAndValue( 'time-interval', 'morning' );
} //end resetTime()

// ============
// HELPER TYPES
// ============

type Datetime = Pick<
	SocialMessage,
	'dateType' | 'dateValue' | 'timeType' | 'timeValue'
>;

type SetDateTypeAndValueAction = {
	readonly type: 'SET_DATE';
	readonly dateType: SocialMessage[ 'dateType' ];
	readonly dateValue: SocialMessage[ 'dateValue' ];
	readonly timeType: SocialMessage[ 'timeType' ];
	readonly timeValue: SocialMessage[ 'timeValue' ];
};

type SetTimeTypeAndValueAction = {
	readonly type: 'SET_TIME';
	readonly timeType: SocialMessage[ 'timeType' ];
	readonly timeValue: SocialMessage[ 'timeValue' ];
};

// =======
// HELPERS
// =======

function getProperDateTime(
	oldDateTime: Datetime,
	newDateTime: Datetime
): Datetime {
	const isToday =
		'predefined-offset' === newDateTime.dateType &&
		'0' === newDateTime.dateValue;

	switch ( oldDateTime.timeType ) {
		case 'exact':
			return newDateTime;

		case 'positive-hours':
			return {
				...newDateTime,
				timeType: ! isToday ? 'time-interval' : oldDateTime.timeType,
				timeValue: ! isToday ? 'morning' : oldDateTime.timeValue,
			};

		case 'time-interval':
			return {
				...newDateTime,
				timeType: isToday ? 'predefined-offset' : oldDateTime.timeType,
				timeValue: isToday ? '0' : oldDateTime.timeValue,
			};

		case 'predefined-offset':
		default:
			return {
				...newDateTime,
				timeType: ! isToday ? 'time-interval' : oldDateTime.timeType,
				timeValue: ! isToday ? 'morning' : oldDateTime.timeValue,
			};
	} //end
} //end getProperDateTime()
