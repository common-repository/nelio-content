/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';

/**
 * External dependencies
 */
import { ReferenceEditor } from '@nelio-content/edit-post';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';
import { TaskEditor } from '@nelio-content/task-editor';

/**
 * Internal dependencies
 */
// TODO DAVID. Check styles in this imports.
import { PromoPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/promo';
import { AnalyticsPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/analytics';
import { EditorialCommentsPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/editorial-comments';
import { EditorialTasksPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/editorial-tasks';
import { ExternalFeaturedImagePanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/external-featured-image';
import { NotificationsPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/notifications';
import { QualityAnalysisPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/quality-analysis';
import { ReferencesPanel } from '../../../gutenberg/plugin/components/tools-sidebar/panels/references';
import { PrePublishChecks } from '../../../gutenberg/plugin/components/pre-publish-checks';

export const ToolsSidebar = (): JSX.Element => (
	<>
		<PrePublishChecks />

		<PromoPanel />
		<QualityAnalysisPanel />
		<AnalyticsPanel />
		<NotificationsPanel />
		<EditorialTasksPanel />
		<EditorialCommentsPanel />
		<ReferencesPanel />
		<ExternalFeaturedImagePanel />

		<ReferenceEditor />
		<SocialMessageEditor />
		<TaskEditor />
	</>
);
