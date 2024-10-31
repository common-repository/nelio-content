/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PluginSidebar } from '@safe-wordpress/edit-post';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	getPremiumComponent,
	PremiumPlaceholderPanel,
} from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { AnalyticsPanel } from './panels/analytics';
import { EditorialCommentsPanel } from './panels/editorial-comments';
import { EditorialTasksPanel } from './panels/editorial-tasks';
import { ExternalFeaturedImagePanel } from './panels/external-featured-image';
import { NotificationsPanel } from './panels/notifications';
import { QualityAnalysisPanel } from './panels/quality-analysis';
import { ReferencesPanel } from './panels/references';
import { SocialMediaPanel } from './panels/social-media';
import { PromoPanel } from './panels/promo';

import { useAreContentToolsEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const ToolsSidebar = (): JSX.Element | null => {
	if ( ! useAreContentToolsEnabled() ) {
		return null;
	} //end if

	const FutureActionsPanel = getPremiumComponent(
		'gutenberg-editor/future-actions-panel',
		() => (
			<PremiumPlaceholderPanel
				title={ _x( 'Future Actions', 'text', 'nelio-content' ) }
				feature="raw/future-actions"
			/>
		)
	);

	return (
		<PluginSidebar
			name="nelio-content-content-tools-sidebar"
			title={ _x( 'Nelio Content Tools', 'text', 'nelio-content' ) }
		>
			<PromoPanel />
			<QualityAnalysisPanel />
			<AnalyticsPanel />
			<SocialMediaPanel />
			<NotificationsPanel />
			<FutureActionsPanel />
			<EditorialTasksPanel />
			<EditorialCommentsPanel />
			<ReferencesPanel />
			<ExternalFeaturedImagePanel />
		</PluginSidebar>
	);
};
