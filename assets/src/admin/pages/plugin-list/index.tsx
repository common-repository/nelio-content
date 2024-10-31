/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import domReady from '@safe-wordpress/dom-ready';
import { render } from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { DeactivationAction } from './components/deactivation-action';
import { InstallPremiumAction } from './components/install-premium-action';

type Settings = {
	readonly cleanNonce: string;
	readonly deactivationUrl: Url;
	readonly isSubscribed: boolean;
	readonly isPremiumActive: boolean;
};

export function initPage( settings: Settings ): void {
	domReady( () => {
		renderDeactivationAction( settings );
		renderPremiumInstallAction();
	} );
} //end initPage()

function renderDeactivationAction( settings: Settings ) {
	const { isPremiumActive, isSubscribed, cleanNonce, deactivationUrl } =
		settings;
	const wrapper = document.querySelector( '.nelio-content-deactivate-link' );
	if ( ! wrapper ) {
		return;
	} //end if

	render(
		<SlotFillProvider>
			<DeactivationAction
				isSubscribed={ isSubscribed }
				isDisabled={ isPremiumActive }
				deactivationUrl={ deactivationUrl }
				cleanNonce={ cleanNonce }
			/>
			<Popover.Slot />
		</SlotFillProvider>,
		wrapper
	);
}

function renderPremiumInstallAction() {
	const wrapper = document.querySelector(
		'.nelio-content-install-premium-action'
	);
	if ( ! wrapper ) {
		return;
	} //end if

	render( <InstallPremiumAction />, wrapper );
}
