/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	PostPageviewsAnalytics,
	PostEngagementAnalytics,
} from '@nelio-content/components';
import {
	usePanelToggling,
	store as NC_EDIT_POST,
} from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const AnalyticsPanel = (): JSX.Element | null => {
	const [ isPanelOpen, togglePanel ] = usePanelToggling( 'post-analytics' );
	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );
	const isPostPublished = post?.status === 'publish';
	const isFeatureEnabled = useIsFeatureEnabled( 'analytics' );

	if ( ! post || ! isFeatureEnabled || ! isPostPublished ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={ _x( 'Analytics', 'text', 'nelio-content' ) }
		>
			<PostPageviewsAnalytics postId={ post.id } />
			<PostEngagementAnalytics postId={ post.id } />
		</PanelBody>
	);
};
