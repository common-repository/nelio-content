/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import {
	store as EDIT_POST,
	PluginPostStatusInfo,
} from '@safe-wordpress/edit-post';

/**
 * External dependencies
 */
import {
	QualityAnalysisSummary,
	SocialMediaSummary,
	store as NC_EDIT_POST,
} from '@nelio-content/edit-post';

export type PostStatusInfoProps = {
	readonly isQualityFullyIntegrated?: boolean;
};

export const PostStatusInfo = ( {
	isQualityFullyIntegrated,
}: PostStatusInfoProps ): JSX.Element => {
	const { openGeneralSidebar } = useDispatch( EDIT_POST );
	const { togglePanel } = useDispatch( NC_EDIT_POST );
	const viewAnalysisDetails = () => {
		void togglePanel( 'post-quality-analysis', true );
		// @ts-expect-error This function should be defined.
		void openGeneralSidebar(
			'nelio-content/nelio-content-default-sidebar'
		);
	};

	return (
		<>
			{ !! isQualityFullyIntegrated && (
				<PluginPostStatusInfo>
					<QualityAnalysisSummary onClick={ viewAnalysisDetails } />
				</PluginPostStatusInfo>
			) }
			<PluginPostStatusInfo>
				<SocialMediaSummary />
			</PluginPostStatusInfo>
		</>
	);
};
