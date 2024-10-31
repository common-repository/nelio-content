/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { render } from '@safe-wordpress/element';
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { settingsSchema } from './utils';
import { Layout } from './components/layout';

export function initPage( id: string, settings: unknown ): void {
	const status = select( NC_DATA ).getPremiumStatus();
	if ( 'ready' === status ) {
		// NOTICE. This should not happen, because this page should only be used when premium is NOT ready.
		return;
	} //end if

	const { page } = settingsSchema.parse( settings );
	const content = document.getElementById( id );
	render( <Layout page={ page } status={ status } />, content );
} //end initPage()
