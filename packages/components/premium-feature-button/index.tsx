/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA, useIsSubscribed } from '@nelio-content/data';
import type { PremiumFeature } from '@nelio-content/types';

/**
 * External dependencies
 */
import './style.scss';

export type PremiumFeatureButtonProps = {
	readonly feature: PremiumFeature;
	readonly variant?: 'primary' | 'secondary' | 'tertiary' | 'default';
	readonly size?: Button.Props[ 'size' ];
	readonly label?: string;
};

export const PremiumFeatureButton = ( {
	feature,
	variant = 'default',
	size,
	label,
}: PremiumFeatureButtonProps ): JSX.Element => {
	const isSubscribed = useIsSubscribed();
	const { openPremiumDialog } = useDispatch( NC_DATA );

	return (
		<Button
			className={
				'default' === variant
					? 'nelio-content-premium-feature-button nelio-content-premium-feature-button--is-premium'
					: 'nelio-content-premium-feature-button'
			}
			variant={ 'default' !== variant ? variant : undefined }
			icon={ isSubscribed ? 'admin-plugins' : 'lock' }
			size={ size }
			onClick={ () => openPremiumDialog( feature ) }
		>
			{ label || _x( 'Premium', 'text', 'nelio-content' ) }
		</Button>
	);
};
