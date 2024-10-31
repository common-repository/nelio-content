/**
 * External references
 */
import { isObject } from 'lodash';
import type {
	AuthorId,
	Dict,
	FreeItemType,
	ItemType,
	MediaId,
	NonEmptyArray,
} from '@nelio-content/types';

export function isFreeItemType( itemType: ItemType ): itemType is FreeItemType {
	const exhaustiveCheck = ( t: FreeItemType ): true => {
		switch ( t ) {
			case 'post':
			case 'task':
			case 'social':
			case 'external-event':
			case 'internal-event':
				return true;
		}
	};
	return !! exhaustiveCheck( itemType as FreeItemType );
} //end isFreeItemType()

const TWITTER_HANDLER_REGEX = /^@[^\s.,:;{}[\]¡!¿?"'“”«»‘’:;&@#\-]+$/;
export function isValidTwitterHandler( value = '' ): boolean {
	return isEmpty( value ) || TWITTER_HANDLER_REGEX.test( value );
} //end isValidTwitterHandler()

export function seemsAuthorId( value?: AuthorId | unknown ): value is AuthorId {
	return 'number' === typeof value && 0 < value;
} //end seemsAuthorId()

export function seemsMediaId( value?: MediaId | unknown ): value is MediaId {
	return 'number' === typeof value && 0 < value;
} //end seemsAuthorId()

export function hasHead< T >(
	value: Array< T > | ReadonlyArray< T >
): value is NonEmptyArray< T > {
	return !! value.length && undefined !== value[ 0 ];
} //end if

export const validateExhaustive =
	< T >() =>
	< U extends Array< T > | ReadonlyArray< T > >(
		array: U & ( [ T ] extends [ U[ number ] ] ? unknown : never )
	): U =>
		array;

const EMPTY_VALUES: unknown[] = [ 0, 0.0, '', false, null, undefined ];
export function isEmpty(
	value: number | undefined | null
): value is 0 | undefined | null;
export function isEmpty(
	value: string | undefined | null
): value is '' | undefined | null;
export function isEmpty< T >(
	value: Array< T > | ReadonlyArray< T > | undefined | null
): value is [] | undefined | null;
export function isEmpty< K extends string | number >(
	value: Partial< Record< K, unknown > > | undefined | null
): value is Record< K, never > | undefined | null;
export function isEmpty( value: unknown ): value is boolean {
	if ( EMPTY_VALUES.includes( value ) ) {
		return true;
	} //end if

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const hasLengthMethod = ( v: any ): v is { length: () => number } =>
		'function' === typeof ( v as Dict ).length;
	if ( hasLengthMethod( value ) && 0 === value.length() ) {
		return true;
	} //end if

	if ( isObject( value ) ) {
		return 0 === Object.keys( value ).length;
	} //end if

	return false;
} //end isEmpty()
