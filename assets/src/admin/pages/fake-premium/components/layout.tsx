/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { SubscriptionRequiredPage } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import type { Page } from '../utils';
import { InvalidPremiumPage } from './invalid-premium-page';

type Props = {
	readonly page: Page;
	readonly status:
		| 'uninstalled'
		| 'inactive'
		| 'unsubscribed'
		| 'invalid-version';
};

export function Layout( { page, status }: Props ): JSX.Element {
	switch ( status ) {
		case 'unsubscribed':
			return <SubscriptionRequiredPage page={ page } />;

		case 'uninstalled':
		case 'inactive':
			return <InvalidPremiumPage page={ page } reason="missing" />;

		case 'invalid-version':
			return <InvalidPremiumPage page={ page } reason={ status } />;
	} //end switch
} //end Layout()
