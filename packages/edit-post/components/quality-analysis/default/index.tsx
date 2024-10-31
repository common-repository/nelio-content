/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';

import { QualityAnalysisSummary } from '../summary';
import { QualityCheck } from './quality-check';

import { store as NC_EDIT_POST } from '../../../store';

export type QualityAnalysisProps = {
	readonly isMetabox?: boolean;
};

export const QualityAnalysis = ( {
	isMetabox,
}: QualityAnalysisProps ): JSX.Element => {
	const [ areDetailsVisible ] = useDetailsControl();
	const qualityCheckTypes = useQualityCheckTypes();
	return (
		<div className="nelio-content-quality-analysis">
			<MetaboxControls enabled={ !! isMetabox } />
			{ areDetailsVisible && (
				<div className="nelio-content-quality-analysis__details">
					{ qualityCheckTypes.map( ( { name, icon } ) => (
						<QualityCheck
							key={ name }
							name={ name }
							icon={ icon }
						/>
					) ) }
				</div>
			) }
		</div>
	);
};

const MetaboxControls = ( { enabled }: { enabled: boolean } ) => {
	const isFullyIntegrated = useIsFullyIntegrated();
	const [ areDetailsVisible, showDetails ] = useDetailsControl();

	if ( ! enabled ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-quality-analysis__summary">
			<div className="nelio-content-quality-analysis__actual-summary">
				<QualityAnalysisSummary />
			</div>
			{ isFullyIntegrated && (
				<Button
					className="nelio-content-quality-analysis__details-toggler"
					size="small"
					onClick={ () => showDetails( ! areDetailsVisible ) }
				>
					<Dashicon
						icon={ areDetailsVisible ? 'arrow-up' : 'arrow-down' }
					/>
				</Button>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsFullyIntegrated = () =>
	useSelect( ( select ) =>
		select( NC_EDIT_POST ).isQualityAnalysisFullyIntegrated()
	);

const useQualityCheckTypes = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getQualityCheckTypes() );

const useDetailsControl = () => {
	const panelName = 'post-quality-analysis';
	const isFullyIntegrated = useIsFullyIntegrated();
	const isQualityPanelOpen = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isPanelOpen( panelName )
	);
	const visible = ! isFullyIntegrated || isQualityPanelOpen;

	const { togglePanel } = useDispatch( NC_EDIT_POST );
	const show = ( v: boolean ) => togglePanel( panelName, v );

	return [ visible, show ] as const;
};
