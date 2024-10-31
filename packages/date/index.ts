/**
 * WordPress dependencies
 */
import { format as originalFormat, getSettings } from '@safe-wordpress/date';
import type { DateSettings } from '@safe-wordpress/date';
/**
 * External dependencies
 */
import momentLib from 'moment';
import 'moment-timezone/moment-timezone';
import 'moment-timezone/moment-timezone-utils';
import type { Moment } from 'moment';
import type { Dict } from '@nelio-content/types';

// This regular expression tests positive for UTC offsets as described in ISO 8601.
// See: https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC
const VALID_UTC_OFFSET = /^[+-][0-1][0-9](:?[0-9][0-9])?$/;

// Exports leveraged from @wordpress/date.
export { getSettings, isInTheFuture, getDate } from '@safe-wordpress/date';

// TODO. There’s an issue when using “originalFormat” with a moment, because they’re no longer using momentjs internally.
export function format(
	dateFormat: string,
	dateValue: string | Date | Moment
): string {
	try {
		return originalFormat( dateFormat, dateValue );
	} catch ( _ ) {
		const hasToIsoString = (
			x: unknown
		): x is { toISOString: () => string } =>
			!! x && 'function' === typeof ( x as Dict ).toISOString;
		return hasToIsoString( dateValue )
			? originalFormat( dateFormat, dateValue.toISOString() )
			: originalFormat( dateFormat );
	}
} //end format()

/**
 * Returns a new Moment instance using the given localDate and localTime.
 *
 * @param {string} dateFormat PHP-style formatting string.
 *                            See php.net/date.
 * @param {string} localDate  A date formatted as 'Y-m-d'.
 * @param {string} localTime  A time formatted as 'H:i'.
 *
 * @return {string} the given date shifted to use WordPress’ timezone.
 */
export function wpifyDateTime(
	dateFormat: string,
	localDate: string,
	localTime: string
): string {
	const dateMoment = buildMoment( new Date() );

	const [ year = '', month = '', day = '' ] = localDate.split( '-' );
	dateMoment.year( Number.parseInt( year ) );
	dateMoment.month( Number.parseInt( month ) - 1 );
	dateMoment.date( Number.parseInt( day ) );

	const [ hour = '', minute = '' ] = localTime.split( ':' );
	dateMoment.hour( Number.parseInt( hour ) );
	dateMoment.minute( Number.parseInt( minute ) );
	dateMoment.seconds( 0 );

	return momentLib( format( dateFormat, dateMoment ) ).toISOString();
} //end wpifyDateTime()

/**
 * Formats a date (like `date()` in PHP).
 *
 * @param {string}                       dateFormat PHP-style formatting string.
 *                                                  See php.net/date.
 * @param {Date|string|Moment|undefined} dateValue  Date object or string, parsable
 *                                                  by moment.js.
 * @param {string|number|undefined}      timezone   Timezone to output result in or a
 *                                                  UTC offset. Defaults to timezone from
 *                                                  site.
 *
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @see https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC
 *
 * @return {string} Formatted date in English.
 */
export function date(
	dateFormat: string,
	dateValue: Date | string | Moment = new Date(),
	timezone?: string | number
): string {
	const dateMoment = buildMoment( dateValue, timezone );
	return format( dateFormat, dateMoment );
} //end date()

/**
 * Formats a date (like `date()` in PHP), in the UTC timezone.
 *
 * @param {string}                       dateFormat PHP-style formatting string.
 *                                                  See php.net/date.
 * @param {Date|string|Moment|undefined} dateValue  Date object or string,
 *                                                  parsable by moment.js.
 *
 * @return {string} Formatted date in English.
 */
export function gmdate(
	dateFormat: string,
	dateValue: Date | string | Moment = new Date()
): string {
	const dateMoment = momentLib( dateValue ).utc();
	return format( dateFormat, dateMoment );
} //end gmdate()

/**
 * Formats a date (like `wp_date()` in PHP), translating it into site's locale.
 *
 * Backward Compatibility Notice: if `timezone` is set to `true`, the function
 * behaves like `gmdateI18n`.
 *
 * @param {string}                          dateFormat PHP-style formatting string.
 *                                                     See php.net/date.
 * @param {Date|string|Moment|undefined}    dateValue  Date object or string, parsable by
 *                                                     moment.js.
 * @param {string|number|boolean|undefined} timezone   Timezone to output result in or a
 *                                                     UTC offset. Defaults to timezone from
 *                                                     site. Notice: `boolean` is effectively
 *                                                     deprecated, but still supported for
 *                                                     backward compatibility reasons.
 *
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @see https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC
 *
 * @return {string} Formatted date.
 */
export function dateI18n(
	dateFormat: string,
	dateValue: Date | string | Moment = new Date(),
	timezone?: string | number | boolean
): string {
	if ( true === timezone ) {
		return gmdateI18n( dateFormat, dateValue );
	}

	if ( false === timezone ) {
		timezone = undefined;
	}

	const dateMoment = buildMoment( dateValue, timezone );
	dateMoment.locale( getSettings().l10n.locale );
	return format( dateFormat, dateMoment );
} //end dateI18n()

/**
 * Formats a date (like `wp_date()` in PHP), translating it into site's locale
 * and using the UTC timezone.
 *
 * @param {string}                       dateFormat PHP-style formatting string.
 *                                                  See php.net/date.
 * @param {Date|string|Moment|undefined} dateValue  Date object or string,
 *                                                  parsable by moment.js.
 *
 * @return {string} Formatted date.
 */
export function gmdateI18n(
	dateFormat: string,
	dateValue: Date | string | Moment = new Date()
): string {
	const dateMoment = momentLib( dateValue ).utc();
	dateMoment.locale( getSettings().l10n.locale );
	return format( dateFormat, dateMoment );
} //end gmdateI18n()

// =======
// HELPERS
// =======

/**
 * Creates a moment instance using the given timezone or, if none is provided, using global settings.
 *
 * @param {Date|string|Moment|undefined} dateValue Date object or string, parsable
 *                                                 by moment.js.
 * @param {string|number|undefined}      timezone  Timezone to output result in or a
 *                                                 UTC offset. Defaults to timezone from
 *                                                 site.
 *
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * @see https://en.wikipedia.org/wiki/ISO_8601#Time_offsets_from_UTC
 *
 * @return {Moment} a moment instance.
 */
function buildMoment(
	dateValue: string | Date | Moment,
	timezone?: string | number
): Moment {
	const dateMoment = momentLib( dateValue );

	if ( timezone ) {
		return isUTCOffset( timezone )
			? dateMoment.utcOffset( timezone )
			: dateMoment.tz( timezone );
	} //end if

	return getSettings().timezone.string
		? dateMoment.tz( getSettings().timezone.string )
		: dateMoment.utcOffset( Number( getSettings().timezone.offset ) || 0 );
} //end buildMoment()

/**
 * Returns whether a certain UTC offset is valid or not.
 *
 * @param {number|string} offset a UTC offset.
 *
 * @return {boolean} whether a certain UTC offset is valid or not.
 */
function isUTCOffset( offset: string | number ): offset is number {
	if ( 'number' === typeof offset ) {
		return true;
	}

	return VALID_UTC_OFFSET.test( offset );
} //end isUTCOffset()

function setSettings( dateSettings: DateSettings ): void {
	// Backup and restore current locale.
	const currentLocale = momentLib.locale();
	momentLib.updateLocale( dateSettings.l10n.locale, {
		// Inherit anything missing from the default locale.
		parentLocale: currentLocale,
		months: dateSettings.l10n.months,
		monthsShort: dateSettings.l10n.monthsShort,
		weekdays: dateSettings.l10n.weekdays,
		weekdaysShort: dateSettings.l10n.weekdaysShort,
		meridiem( hour, _, isLowercase ) {
			if ( hour < 12 ) {
				return isLowercase
					? dateSettings.l10n.meridiem.am
					: dateSettings.l10n.meridiem.AM;
			}
			return isLowercase
				? dateSettings.l10n.meridiem.pm
				: dateSettings.l10n.meridiem.PM;
		},
		longDateFormat: {
			LT: dateSettings.formats.time,
			LTS: '',
			L: '',
			LL: dateSettings.formats.date,
			LLL: dateSettings.formats.datetime,
			LLLL: '',
		},
		// From human_time_diff?
		// Set to `(number, withoutSuffix, key, isFuture) => {}` instead.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		relativeTime: dateSettings.l10n.relative as any,
	} );
	momentLib.locale( currentLocale );

	// Create WP timezone based off dateSettings.
	momentLib.tz.add(
		momentLib.tz.pack( {
			name: 'WP',
			abbrs: [ 'WP' ],
			untils: [ null ],
			// eslint-disable-next-line @typescript-eslint/no-unsafe-unary-minus
			offsets: [ -dateSettings.timezone.offset * 60 || 0 ],
		} )
	);
} //end setSettings()

( () => {
	const oldSettings = getSettings();
	const offset = Number( oldSettings.timezone.offset );
	const settings = {
		...oldSettings,
		timezone: {
			...oldSettings.timezone,
			offset: isNaN( offset ) ? 0 : offset,
		},
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
	setSettings( settings as any );
} )();
