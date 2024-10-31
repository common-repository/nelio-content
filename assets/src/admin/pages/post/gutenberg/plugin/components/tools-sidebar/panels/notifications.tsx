/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Notifications, usePanelToggling } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const NotificationsPanel = (): JSX.Element | null => {
	const [ isPanelOpen, togglePanel ] = usePanelToggling( 'notifications' );

	if ( ! useIsFeatureEnabled( 'notifications' ) ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={ _x( 'Notifications', 'text', 'nelio-content' ) }
		>
			<Notifications />
		</PanelBody>
	);
};
