/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	PostEngagementAnalytics,
	PostPageviewsAnalytics,
} from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { Section } from '../section';
import { store as NC_EDIT_POST } from '../../../../store';

export const AnalyticsSection = (): JSX.Element | null => {
	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );
	const isPostPublished = 'publish' === post?.status;
	const isFeatureEnabled = useSelect( ( select ) =>
		select( NC_DATA )
			.getPostTypes( 'analytics' )
			.some( ( pt ) => pt.name === post.type )
	);

	if ( ! post || ! isFeatureEnabled || ! isPostPublished ) {
		return null;
	} //end if

	return (
		<Section
			icon="chart-bar"
			title={ _x( 'Analytics', 'text', 'nelio-content' ) }
			type="analytics"
		>
			<PostPageviewsAnalytics postId={ post.id } />
			<PostEngagementAnalytics postId={ post.id } />
		</Section>
	);
};
