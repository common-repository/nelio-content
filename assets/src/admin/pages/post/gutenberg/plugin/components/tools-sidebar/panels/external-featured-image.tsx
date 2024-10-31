/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	ExternalFeaturedImage,
	usePanelToggling,
} from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const ExternalFeaturedImagePanel = (): JSX.Element | null => {
	const [ isPanelOpen, togglePanel ] = usePanelToggling(
		'external-featured-image'
	);

	if ( ! useIsFeatureEnabled( 'efi' ) ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={ _x( 'External Featured Image', 'text', 'nelio-content' ) }
		>
			<ExternalFeaturedImage />
		</PanelBody>
	);
};
