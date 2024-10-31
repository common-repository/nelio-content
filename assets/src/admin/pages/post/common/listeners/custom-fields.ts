/**
 * WordPress dependencies
 */
import domReady from '@safe-wordpress/dom-ready';

/**
 * External dependencies
 */
import { make } from 'ts-brand';
import type { MetaKey } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToCustomFields( {
	setCustomField,
	removeCustomField,
}: Actions ): void {
	domReady( () => {
		/* eslint-disable */
		const jQuery = ( window as any ).jQuery;
		/* eslint-enable */
		if ( ! isJQuery( jQuery ) ) {
			return;
		} //end if

		jQuery.ajaxPrefilter( ( opts, oriOpts ) => {
			if ( ! hasData( opts ) || 'string' !== typeof opts.data ) {
				return;
			} //end if

			if ( ! hasData( oriOpts ) || ! hasAction( oriOpts ) ) {
				return;
			} //end if

			const data = new URLSearchParams( opts.data );
			switch ( oriOpts.action ) {
				case 'add-meta': {
					if ( data.has( 'metavalue' ) ) {
						const key =
							data.get( 'metakeyselect' ) === '#NONE#'
								? data.get( 'metakeyinput' )
								: data.get( 'metakeyselect' );
						const value = data.get( 'metavalue' ) || '';

						if ( key ) {
							void setCustomField( mk( key ), value );
						} //end if
					} else {
						const metaKey = Array.from( data.keys() )
							.filter( ( k ) => /meta\[\d+\]\[key\]/.test( k ) )
							.map( ( k ) => data.get( k ) )[ 0 ];
						const metaValue = Array.from( data.keys() )
							.filter( ( k ) => /meta\[\d+\]\[value\]/.test( k ) )
							.map( ( k ) => data.get( k ) )[ 0 ];

						// TODO. @Toni » why previous has metavalue to empty string and not this one?
						if ( metaKey && metaValue ) {
							void setCustomField( mk( metaKey ), metaValue );
						} //end if
					} //end if
					break;
				}

				case 'delete-meta': {
					const id = data.get( 'id' );
					const el = id
						? document.getElementById( `meta-${ id }-key` )
						: null;
					const key = el?.getAttribute( 'value' );
					if ( key ) {
						void removeCustomField( mk( key ) );
					} //end if
					break;
				}
			}
		} );
	} );
} //listenToCustomFields()

// =======
// HELPERS
// =======

const mk = make< MetaKey >();

const isJQuery = ( x?: unknown ): x is JQuery =>
	!! x && typeof x === 'function' && 'ajaxPrefilter' in x;

type JQuery = {
	readonly ajaxPrefilter: (
		handler: ( opts: unknown, originalOpts: unknown ) => void
	) => void;
};

const hasData = ( x?: unknown ): x is { data: unknown } =>
	!! x && 'object' === typeof x && 'data' in x;

const hasAction = ( x?: unknown ): x is { action: string } =>
	!! x && 'object' === typeof x && 'action' in x;
