/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { getPremiumComponent } from '@nelio-content/components';
import {
	EditorialComments,
	EditorialTasks,
	ExternalFeaturedImage,
	Notifications,
	QualityAnalysis,
	References,
	SocialMediaMetabox,
} from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { renderMetaBox } from '../common';

const QualityAnalysisMetabox = () => <QualityAnalysis isMetabox />;

export function renderMetaBoxes(): void {
	renderMetaBox( 'nelio-content-quality-analysis', QualityAnalysisMetabox );
	renderMetaBox( 'nelio-content-editorial-comments', EditorialComments );
	renderMetaBox(
		'nelio-content-future-actions',
		getPremiumComponent( 'post-page/future-actions', 'raw/future-actions' )
	);
	renderMetaBox( 'nelio-content-editorial-tasks', EditorialTasks );
	renderMetaBox( 'nelio-content-featured-image', ExternalFeaturedImage );
	renderMetaBox( 'nelio-content-notifications', Notifications );
	renderMetaBox( 'nelio-content-links', References );
	renderMetaBox( 'nelio-content-social-media', SocialMediaMetabox );
} //end renderMetaBoxes()
