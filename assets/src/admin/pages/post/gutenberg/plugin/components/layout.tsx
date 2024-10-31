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
 * External dependencies
 */
import { getPremiumComponent, PremiumDialog } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { PostStatusInfo } from './post-status-info';
import { PrePublishChecks } from './pre-publish-checks';
import { ToolsSidebar } from './tools-sidebar';
import { SocialSidebar } from './social-sidebar';

export type LayoutProps = {
	readonly isQualityFullyIntegrated?: boolean;
};

export const Layout = ( {
	isQualityFullyIntegrated,
}: LayoutProps ): JSX.Element => {
	const FutureActionEditor = getPremiumComponent(
		'post-page/future-action-editor',
		'null'
	);
	return (
		<>
			<PostStatusInfo
				isQualityFullyIntegrated={ isQualityFullyIntegrated }
			/>
			<PrePublishChecks />

			<ToolsSidebar />
			<SocialSidebar />

			<ReferenceEditor />
			<SocialMessageEditor />
			<TaskEditor />
			<FutureActionEditor />

			<PremiumDialog />
		</>
	);
};
