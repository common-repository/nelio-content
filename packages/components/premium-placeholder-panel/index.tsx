/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import { Dashicon } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import { store as NC_DATA, useIsSubscribed } from '@nelio-content/data';
import type { PremiumFeature } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type PremiumPlaceholderPanelProps = {
	readonly title: string;
	readonly feature: PremiumFeature;
};

export const PremiumPlaceholderPanel = ( {
	title,
	feature,
}: PremiumPlaceholderPanelProps ): JSX.Element => {
	const isSubscribed = useIsSubscribed();
	const { openPremiumDialog } = useDispatch( NC_DATA );
	return (
		<div className="nelio-content-premium-placeholder-panel components-panel__body">
			<h2 className="components-panel__body-title">
				<button
					onClick={ () => openPremiumDialog( feature ) }
					className="components-button components-panel__body-toggle"
					type="button"
				>
					<span className="nelio-content-premium-placeholder-panel__title">
						{ title }
					</span>
					<span className="nelio-content-premium-placeholder-panel__icon">
						<Dashicon
							icon={ isSubscribed ? 'admin-plugins' : 'lock' }
						/>
					</span>
				</button>
			</h2>
		</div>
	);
};
