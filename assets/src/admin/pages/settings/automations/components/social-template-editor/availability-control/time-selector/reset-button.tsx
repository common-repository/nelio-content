/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */

export type ResetButtonProps = {
	readonly onClick: () => void;
};

export const ResetButton = ( { onClick }: ResetButtonProps ): JSX.Element => {
	return (
		<div className="nelio-content-social-template-editor__reset-time-button">
			<Button variant="link" onClick={ onClick }>
				{ _x( 'Change', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};
