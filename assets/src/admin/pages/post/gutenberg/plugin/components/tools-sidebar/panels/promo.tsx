/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { SubscribeAction } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { hasSubscriptionPromo } from '@nelio-content/utils';

export const PromoPanel = (): JSX.Element | null => {
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );

	if ( ! hasSubscriptionPromo( today ) ) {
		return null;
	} //end if

	return (
		<div style={ { padding: '1em', display: 'flex' } }>
			<div style={ { textAlign: 'center', width: '100%' } }>
				<SubscribeAction />
			</div>
		</div>
	);
};
