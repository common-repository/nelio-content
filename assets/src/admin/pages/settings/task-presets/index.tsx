/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { select } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ContextualHelp } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './store';
import { walkthrough } from './walkthrough';
import { Layout } from './components/layout';

export function initPage( id: string ): void {
	const subscribed = select( NC_DATA ).isSubscribed();
	const content = document.getElementById( id );
	render( <Layout />, content );

	const help = document.getElementById( 'nelio-content-settings-title' );
	if ( subscribed && help ) {
		render(
			<ContextualHelp
				context="social-task-presets"
				walkthrough={ walkthrough }
				autostart={ true }
				component={ HelpButton }
			/>,
			help
		);
	} //end if
} //end initPage()

// =======
// HELPERS
// =======

const HelpButton = ( {
	className,
	runWalkthrough,
}: {
	readonly className: string;
	readonly runWalkthrough: () => void;
} ) => (
	<button
		className={ `${ className }  page-title-action` }
		onClick={ runWalkthrough }
	>
		{ _x( 'Help', 'text', 'nelio-content' ) }
	</button>
);
