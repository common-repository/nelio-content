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
	QualityAnalysis,
	QualityAnalysisSummary,
	usePanelToggling,
} from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const QualityAnalysisPanel = (): JSX.Element | null => {
	const [ isPanelOpen, togglePanel ] = usePanelToggling(
		'post-quality-analysis'
	);

	if ( ! useIsFeatureEnabled( 'quality-checks' ) ) {
		return null;
	} //end if

	const title = (
		<QualityAnalysisSummary
			label={ _x( 'Quality Analysis', 'text', 'nelio-content' ) }
		/>
	);

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={
				// eslint-disable-next-line
				title as any
			}
		>
			<QualityAnalysis />
		</PanelBody>
	);
};
