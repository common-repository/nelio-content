/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SocialMediaTools, usePanelToggling } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const SocialMediaPanel = (): JSX.Element | null => {
	const [ isPanelOpen, togglePanel ] = usePanelToggling( 'social-media' );

	if ( ! useIsFeatureEnabled( 'social' ) ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={ _x( 'Social Media', 'text', 'nelio-content' ) }
		>
			<SocialMediaTools />
		</PanelBody>
	);
};
