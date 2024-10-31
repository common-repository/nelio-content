/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DeleteButton } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { useCanUseAutomations, useIsTimelineBusy } from '../../hooks';
import { store as NC_EDIT_POST } from '../../../../store';

export type ClearTimelineButtonProps = {
	readonly isSmall?: boolean;
};

export const ClearTimelineButton = ( {
	isSmall,
}: ClearTimelineButtonProps ): JSX.Element => {
	const isTimelineBusy = useIsTimelineBusy();
	const canUseAutomations = useCanUseAutomations();
	const { clearTimeline } = useDispatch( NC_EDIT_POST );
	return (
		<DeleteButton
			size={ isSmall ? 'small' : undefined }
			disabled={ ! canUseAutomations }
			onClick={ clearTimeline }
			isDeleting={ isTimelineBusy }
			labels={ {
				delete: _x( 'Clear Timeline', 'command', 'nelio-content' ),
				deleting: _x( 'Clearing Timeline…', 'text', 'nelio-content' ),
			} }
			confirmationLabels={ {
				title: _x( 'Clear Timeline', 'text', 'nelio-content' ),
				text: _x(
					'Are you sure you want to clear your timeline? This operation can’t be undone and you’ll lose any manual messages you might have created.',
					'user',
					'nelio-content'
				),
			} }
		/>
	);
};
