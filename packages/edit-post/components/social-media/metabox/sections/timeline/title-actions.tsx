/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useCanUseAutomations,
	useHasUsableAutomationGroups,
} from '../../../hooks';
import { ClearTimelineButton } from '../../../common/clear-timeline-button';
import { store as NC_EDIT_POST } from '../../../../../store';

export type TitleActionsProps = {
	readonly enabled: boolean;
};

export const TitleActions = ( {
	enabled,
}: TitleActionsProps ): JSX.Element | null => {
	const hasAutomations = useHasUsableAutomationGroups();
	const canUseAutomations = useCanUseAutomations();
	const isGeneratingTimeline = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isGeneratingTimeline()
	);

	const { savePostAndGenerateTimeline } = useDispatch( NC_EDIT_POST );

	if ( ! enabled ) {
		return null;
	} //end if

	return (
		<>
			{ hasAutomations && (
				<Button
					size="small"
					variant="secondary"
					isBusy={ isGeneratingTimeline }
					disabled={ ! canUseAutomations }
					onClick={ savePostAndGenerateTimeline }
				>
					{ isGeneratingTimeline
						? _x( 'Generating Timeline…', 'text', 'nelio-content' )
						: _x(
								'Regenerate Timeline',
								'command',
								'nelio-content'
						  ) }
				</Button>
			) }
			<ClearTimelineButton isSmall />
		</>
	);
};
