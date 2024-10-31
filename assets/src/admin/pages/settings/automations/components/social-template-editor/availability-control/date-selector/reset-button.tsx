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
	readonly resetDateTime: () => void;
};

export const ResetButton = ( {
	resetDateTime,
}: ResetButtonProps ): JSX.Element => {
	return (
		<div className="nelio-content-social-template-editor__reset-date-button">
			<Button variant="link" onClick={ () => resetDateTime() }>
				{ _x( 'Change', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};
