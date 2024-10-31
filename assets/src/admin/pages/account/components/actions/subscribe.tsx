/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { getSubscribeLabel, getSubscribeLink } from '@nelio-content/utils';

export const SubscribeAction = (): JSX.Element => {
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );

	const label = getSubscribeLabel( today );
	const link = getSubscribeLink( today, 'account-page' );

	return (
		<ExternalLink className="components-button is-primary" href={ link }>
			{ label }
		</ExternalLink>
	);
};
