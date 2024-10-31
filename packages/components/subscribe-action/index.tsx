/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import {
	hasSubscriptionPromo,
	getSubscribeLabel,
	getSubscribeLink,
} from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';

export type SubscribeActionProps = {
	readonly className?: string;
};

export const SubscribeAction = ( {
	className: givenClassName = '',
}: SubscribeActionProps ): JSX.Element | null => {
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );
	const isSubscribed = useSelect( ( select ) =>
		select( NC_DATA ).isSubscribed()
	);

	if ( isSubscribed ) {
		return null;
	} //end if

	const hasPromo = hasSubscriptionPromo( today );
	const className = hasPromo
		? 'nelio-content-subscribe-action nelio-content-subscribe-action--has-promo dashicons-buddicons-groups is-secondary '
		: 'nelio-content-subscribe-action dashicons-cart is-primary ';

	return (
		<a
			className={ `${ className } ${ givenClassName } components components-button dashicons-before` }
			href={ getSubscribeLink( today, 'subscribe-with-coupon' ) }
			target="_blank"
			rel="noreferrer"
		>
			{ getSubscribeLabel( today ) }
		</a>
	);
};
