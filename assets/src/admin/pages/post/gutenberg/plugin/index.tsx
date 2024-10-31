/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { registerPlugin } from '@safe-wordpress/plugins';

/**
 * Internal dependencies
 */
import { Layout } from './components/layout';
import type { LayoutProps } from './components/layout';

import NelioContentIcon from '~/nelio-content-images/logo.svg';

export function initPlugin( props: LayoutProps ): void {
	registerPlugin( 'nelio-content', {
		// eslint-disable-next-line
		icon: ( <NelioContentIcon /> ) as any,
		render: () => <Layout { ...props } />,
	} );
} //end initPlugin()
