/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { select, dispatch } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_FEEDS } from './store';

import { Layout } from './components/layout';

export function initPage( id: string ): void {
	loadFeedItems();
	const content = document.getElementById( id );
	render( <Layout />, content );
} //end initPage()

// =======
// HELPERS
// =======

function loadFeedItems() {
	const { getFeedIds } = select( NC_DATA );
	const { loadFeedItems: load } = dispatch( NC_FEEDS );

	const feeds = getFeedIds();
	feeds.forEach( ( id ) => void load( id ) );
} //end loadFeedItems()
