/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './store';
import { AccountProvider } from './components/provider';
import { Layout } from './components/layout';
import { PageTitle } from './components/page-title';

type Settings = {
	readonly isSubscribed: boolean;
	readonly siteId: Uuid;
};

export function initPage( id: string, settings: Settings ): void {
	const { siteId, isSubscribed } = settings;

	const content = document.getElementById( id );
	render(
		<SlotFillProvider>
			<PageTitle isSubscribed={ isSubscribed } siteId={ siteId } />
			<AccountProvider>
				<Layout />
			</AccountProvider>
			<Popover.Slot />
		</SlotFillProvider>,
		content
	);
} //end initPage()
