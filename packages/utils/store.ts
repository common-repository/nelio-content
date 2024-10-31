/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import localStore from 'store';
import type { StoreValue } from 'store';
import type { Maybe } from '@nelio-content/types';

// NOTE. Dependency loop with @nelio-content/data.
import type { store } from '@nelio-content/data';
const NC_DATA = 'nelio-content/data' as unknown as typeof store;

/**
 * Saves the given key/value pair in the browser’s store.
 *
 * @param {string} key      a key that identifies the value.
 * @param {any}    value    the specific value.
 * @param {number} lifespan Optional. The number of seconds the value should be valid.
 *                          If not set, the key/value pair never expires.
 */
export function setValue< T >( key: string, value: T, lifespan = 0 ): void {
	const storeKey = getStoreKey( key );
	if ( ! storeKey ) {
		return;
	} //end if

	if ( lifespan ) {
		localStore.set( storeKey, {
			value,
			expiration: new Date().getTime() + lifespan * 1000,
		} );
	} else {
		localStore.set( storeKey, { value } );
	} //end if
} //end setValue()

export function getValue< T >( key: string ): Maybe< T >;
export function getValue< T >( key: string, defaultValue: T ): T;
export function getValue< T >( key: string, defaultValue?: T ): Maybe< T >;
/**
 * Returns the value of the given key if any. If it’s not set, it returns `default`.
 *
 * @param {string} key          the key that identifies the value we’re interested in.
 * @param {any}    defaultValue Optional. Default value.
 *
 * @return {any} the value of the given key in the store, if available and valid; `default`, if there’s no such value; `undefined` otherwise.
 */
export function getValue< T >( key: string, defaultValue?: T ): Maybe< T > {
	const storeKey = getStoreKey( key );
	if ( ! storeKey ) {
		return defaultValue;
	} //end if

	const value = localStore.get< T >( storeKey );
	if ( ! value ) {
		return defaultValue;
	} //end if

	if ( value.expiration && value.expiration < new Date().getTime() ) {
		clearValue( key );
		return defaultValue;
	} //end if

	return value.value;
} //end getValue()

export function clearValue( key: string ): void {
	const storeKey = getStoreKey( key );
	if ( ! storeKey ) {
		return;
	} //end if

	localStore.remove( storeKey );
} //end clearValue()

function getStoreKey( key: string ): Maybe< string > {
	const functions = select( NC_DATA );
	if ( ! functions ) {
		return;
	} //end if

	const { getSiteId } = functions;
	const siteId = getSiteId();
	if ( ! siteId ) {
		return;
	} //end if

	return `NelioContent[${ siteId }][${ key }]`;
} //end getStoreKey()

setTimeout( () => {
	localStore.each( ( value: StoreValue, key: string ) => {
		const functions = select( NC_DATA );
		if ( ! functions ) {
			return;
		} //end if

		const { getSiteId } = functions;
		const siteId = getSiteId();
		if ( ! siteId ) {
			return;
		} //end if

		if ( ! key.startsWith( `NelioContent[${ siteId }]` ) ) {
			return;
		} //end if

		if ( ! value || ! value.expiration ) {
			return;
		} //end if

		if ( value.expiration > new Date().getTime() ) {
			return;
		} //end if

		localStore.remove( key );
	} );
}, 1000 );
