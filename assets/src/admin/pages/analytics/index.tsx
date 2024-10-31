/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { dispatch, select } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_ANALYTICS } from './store';
import { Layout } from './components/layout';

export function initPage( id: string ): void {
	const content = document.getElementById( id );
	render( <Layout />, content );

	setCorrectSortingCriterion();
	loadPostAnalytics();
} //end initPage()

// =======
// HELPERS
// =======

function setCorrectSortingCriterion() {
	const { isGAConnected } = select( NC_DATA );
	if ( isGAConnected() ) {
		return;
	} //end if

	const { sortBy } = dispatch( NC_ANALYTICS );
	void sortBy( 'engagement' );
} //end setCorrectSortingCriterion()

function loadPostAnalytics() {
	const { loadPosts } = dispatch( NC_ANALYTICS );
	void loadPosts();
} //end loadPostAnalytics()
