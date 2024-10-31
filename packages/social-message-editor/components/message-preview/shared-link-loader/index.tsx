/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

export const SharedLinkLoader = (): JSX.Element => (
	<div className="nelio-content-shared-link-loader">
		<Spinner />
	</div>
);
