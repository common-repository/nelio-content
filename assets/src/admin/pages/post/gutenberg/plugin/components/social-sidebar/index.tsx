/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PluginSidebar } from '@safe-wordpress/edit-post';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SocialMediaSidebar } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const SocialSidebar = (): JSX.Element | null => {
	if ( ! useIsFeatureEnabled( 'social' ) ) {
		return null;
	} //end if

	return (
		<PluginSidebar
			name="nelio-content-social-sidebar"
			title={ _x( 'Nelio Content Social', 'text', 'nelio-content' ) }
			icon="share"
		>
			<SocialMediaSidebar />
		</PluginSidebar>
	);
};
