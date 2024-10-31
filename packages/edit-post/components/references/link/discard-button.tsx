/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DeleteButton } from '@nelio-content/components';

export type DiscardButtonProps = {
	readonly onClick: () => void;
};

export const DiscardButton = ( {
	onClick,
}: DiscardButtonProps ): JSX.Element => (
	<DeleteButton
		labels={ {
			delete: _x( 'Discard', 'command', 'nelio-content' ),
			deleting: _x( 'Discarding…', 'text', 'nelio-content' ),
		} }
		confirmationLabels={ {
			title: _x( 'Discard Reference', 'text', 'nelio-content' ),
			text: _x(
				'Are you sure you want to discard this reference? This operation can’t be undone.',
				'user',
				'nelio-content'
			),
		} }
		onClick={ onClick }
	/>
);
