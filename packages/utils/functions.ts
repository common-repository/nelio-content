/**
 * WordPress dependencies
 */
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { isArray, isEqual, keys, map, sortBy, values } from 'lodash';
import { format, getDate } from '@nelio-content/date';
import type { Dict, Maybe } from '@nelio-content/types';

const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
const HOUR_IN_MILLIS = 60 * 60 * 1000;

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export function assertUnreachable( _: never ): never {
	throw new Error( 'This code should be unreachable' );
} //end assertUnreachable()

export function isDefined< T >( x: Maybe< T > ): x is T {
	return x !== undefined;
} //end isDefined

export const replace = < T >(
	oldValue: T,
	newValue: T,
	array: ReadonlyArray< T >
): ReadonlyArray< T > =>
	map( array, ( v ) => ( v === oldValue ? newValue : v ) );

export const replaceOrAppend = < T >(
	oldValue: T,
	newValue: T,
	array: ReadonlyArray< T >
): ReadonlyArray< T > =>
	array.includes( oldValue )
		? replace( oldValue, newValue, array )
		: [ ...array, newValue ];

export function isEquivalent( a: Dict, b: Dict ): boolean {
	if ( isEqual( a, b ) ) {
		return true;
	} //end if

	const aKeys = sortBy( keys( a ) );
	const bKeys = sortBy( keys( b ) );
	if ( ! isEqual( aKeys, bKeys ) ) {
		return false;
	} //end if

	for ( const key of aKeys ) {
		let va = a[ key ];
		if ( isArray( va ) ) {
			va = sortBy( va );
		} //end if

		let vb = b[ key ];
		if ( isArray( vb ) ) {
			vb = sortBy( vb );
		} //end if

		if ( ! isEqual( va, vb ) ) {
			return false;
		} //end if
	} //end for

	return true;
} //end isEquivalent()

export const addDays = ( date: string, days: number ): string => {
	const d = getDate( `${ date }T10:00:00.000Z` );
	d.setDate( d.getDate() + days );
	return format( 'Y-m-d', d );
};

export const diffDays = ( d1: string, d2: string ): number => {
	const date1 = new Date( d1 ).getTime();
	const date2 = new Date( d2 ).getTime();
	return ( date1 - date2 ) / DAY_IN_MILLIS;
};

export const diffHours = ( d1: string, d2: string ): number => {
	const date1 = new Date( d1 ).getTime();
	const date2 = new Date( d2 ).getTime();
	return ( date1 - date2 ) / HOUR_IN_MILLIS;
};

export async function showErrorNotice(
	error: unknown,
	defaultMessage?: string,
	options?: Record< string, unknown >
): Promise< void > {
	const message = getErrorMessage( error, defaultMessage );
	await dispatch( NOTICES ).createErrorNotice( message, options );
} //end showErrorNotice()

export function logError( error: unknown ): void {
	const message = getErrorMessage( error );
	// eslint-disable-next-line no-console
	console.log( message );
} //end logError()

// ========
// INTERNAL
// ========

function getErrorMessage( e: unknown, defaultMessage?: string ): string {
	const exception: Exception = isException( e ) ? e : {};
	const errors = exception.errors ? values( exception.errors ) : [];
	return (
		errors[ 0 ] ||
		exception.message ||
		defaultMessage ||
		_x( 'Something went wrong.', 'text', 'nelio-ab-testing' )
	);
} //end getErrorMessage()

type Exception = { errors?: [ string ]; message?: string };
function isException( e: unknown ): e is Exception {
	if ( ! e || 'object' !== typeof e ) {
		return false;
	} //end if
	if ( 'message' in e && 'string' === typeof e.message ) {
		return true;
	} //end if
	if (
		'errors' in e &&
		'object' === typeof e.errors &&
		!! e.errors &&
		'0' in e.errors &&
		'string' === typeof e.errors[ 0 ]
	) {
		return true;
	} //end if
	return false;
} //end isException()
