/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PluginPrePublishPanel } from '@safe-wordpress/edit-post';

/**
 * Internal dependencies
 */
import { QualityAnalysisPanel } from './tools-sidebar/panels/quality-analysis';

export const PrePublishChecks = (): JSX.Element => (
	<PluginPrePublishPanel>
		<QualityAnalysisPanel />
	</PluginPrePublishPanel>
);
