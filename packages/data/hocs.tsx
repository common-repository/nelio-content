/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { createHigherOrderComponent } from '@safe-wordpress/compose';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, __ } from '@safe-wordpress/i18n';
import type { PremiumFeature } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from './store';
import { useAdminUrl, useCanManagePlugin } from './hooks';

export const withProfileCheck = createHigherOrderComponent(
	( Component: ( _: unknown ) => JSX.Element ) => ( props ) => {
		const hasProfiles = useSelect(
			( select ) => 0 < select( NC_DATA ).getSocialProfileCount()
		);
		const canManagePlugin = useCanManagePlugin();
		const settingsUrl = useAdminUrl( 'admin.php', {
			page: 'nelio-content-settings',
			subpage: 'social--profiles',
		} );

		if ( hasProfiles ) {
			return <Component { ...props } />;
		} //end if

		if ( ! canManagePlugin ) {
			return (
				<p>
					{ _x(
						'Nelio Content helps you to engage with your audience by sharing your WordPress content on social media. Please ask the site manager to connect one or more social profiles to Nelio Content.',
						'user',
						'nelio-content'
					) }
				</p>
			);
		} //end if

		return (
			<div>
				<p>
					{ _x(
						'Nelio Content helps you to engage with your audience by sharing your WordPress content on social media. Connect one or more social profiles and then refresh this page to use them.',
						'user',
						'nelio-content'
					) }
				</p>
				<div style={ { textAlign: 'center' } }>
					<ExternalLink
						className="components-button is-secondary"
						href={ settingsUrl }
					>
						{ _x( 'Connect Profiles', 'command', 'nelio-content' ) }
					</ExternalLink>
				</div>
			</div>
		);
	},
	'withProfileCheck'
);

export const withSubscriptionCheck = <
	C extends ( props: unknown ) => JSX.Element | null,
>(
	feature: PremiumFeature,
	component: C
): C =>
	createHigherOrderComponent(
		( Component: C ) => ( props ) => {
			const isSubscribed = useSelect( ( select ) =>
				select( NC_DATA ).isSubscribed()
			);
			const { openPremiumDialog } = useDispatch( NC_DATA );

			if ( isSubscribed ) {
				return <Component { ...props } />;
			} //end if

			return (
				<div>
					<p>
						<Button
							variant="primary"
							icon="lock"
							onClick={ () => openPremiumDialog( feature ) }
						>
							{ _x( 'Premium', 'text', 'nelio-content' ) }
						</Button>
					</p>
				</div>
			);
		},
		'withSubscriptionCheck'
	)( component ) as C;
