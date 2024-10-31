/**
 * External dependencies
 */
import moment from 'moment';
import { date, wpifyDateTime } from '@nelio-content/date';
import { extractDateTimeValues } from '@nelio-content/utils';
import type {
	DateType,
	EditorialTask,
	Post,
	SocialMessage,
} from '@nelio-content/types';

export function setNewDayAndTimeInPost(
	newLocalDay: string,
	newLocalHour: string,
	post: Post
): Post {
	return {
		...post,
		date: wpifyDateTime( 'c', newLocalDay, newLocalHour ),
	};
} //end setNewDayAndTimeInPost()

export function setNewDayInSocialMessage(
	newLocalDay: string,
	message: SocialMessage
): SocialMessage {
	const { utcDate, dateType, dateValue } = getNewDayAttributes( {
		dateType: message.dateType,
		dateValue: message.dateValue,
		newLocalDay,
		utcDate: message.schedule ?? '',
	} );
	return {
		...message,
		dateType,
		dateValue,
		schedule: utcDate,
	};
} //end setNewDayInSocialMessage()

export function setNewDayAndTimeInSocialMessage(
	newLocalDay: string,
	newLocalHour: string,
	message: SocialMessage
): SocialMessage {
	const { dateValue } = extractDateTimeValues( message.schedule ) ?? {};
	message = {
		...message,
		timeType: 'exact',
		timeValue: newLocalHour,
		schedule: wpifyDateTime( 'c', dateValue ?? '', newLocalHour ),
	};
	return setNewDayInSocialMessage( newLocalDay, message );
} //end setNewDayAndTimeInSocialMessage()

export function setNewDayInTask(
	newLocalDay: string,
	task: EditorialTask
): EditorialTask {
	const { utcDate, dateType, dateValue } = getNewDayAttributes( {
		dateType: task.dateType,
		dateValue: task.dateValue,
		newLocalDay,
		utcDate: task.dateDue,
	} );
	return {
		...task,
		dateType,
		dateValue,
		dateDue: utcDate,
	};
} //end setNewDayInTask()

// =======
// HELPERS
// =======

function getNewDayAttributes( attrs: {
	readonly utcDate: string;
	readonly dateType: DateType;
	readonly dateValue: string;
	readonly newLocalDay: string;
} ): {
	readonly utcDate: string;
	readonly dateType: DateType;
	readonly dateValue: string;
} {
	const { utcDate, dateType, dateValue, newLocalDay } = attrs;

	if ( 'exact' === dateType ) {
		const time = date( 'H:i', utcDate );
		return {
			utcDate: wpifyDateTime( 'c', newLocalDay, time ),
			dateType,
			dateValue: newLocalDay,
		};
	} //end if

	const originalLocalDay = date( 'Y-m-d', utcDate );

	const originalLocalDate = moment( `${ originalLocalDay }T12:00:00.000Z` );
	const newLocalDate = moment( `${ newLocalDay }T12:00:00.000Z` );

	const difference = newLocalDate.diff( originalLocalDate, 'days' );
	const oldOffset =
		'negative-days' === dateType
			? -Number.parseInt( dateValue )
			: Number.parseInt( dateValue );

	const newOffset = oldOffset + difference;
	if ( newOffset < 0 ) {
		return {
			utcDate: moment( utcDate ).add( difference, 'days' ).toISOString(),
			dateType: 'negative-days',
			dateValue: `${ Math.abs( newOffset ) }`,
		};
	} //end if

	return {
		utcDate: moment( utcDate ).add( difference, 'days' ).toISOString(),
		dateType: 'positive-days',
		dateValue: `${ newOffset }`,
	};
} //end getNewDayAttributes()
