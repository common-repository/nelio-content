/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../store';

export type ResetButtonProps = {
	readonly disabled?: boolean;
};

export const ResetButton = ( { disabled }: ResetButtonProps ): JSX.Element => {
	const { resetDateTime } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<div className="nelio-content-social-message-editor__reset-date-button">
			<Button
				variant="link"
				disabled={ disabled }
				onClick={ () => resetDateTime() }
			>
				{ _x( 'Change', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};
