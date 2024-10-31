/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Layout } from './components/layout';

export function initSections(): void {
	const container = document.getElementById(
		'elementor-nelio-content__elements'
	);
	render( <Layout />, container );
} //end initSections()
