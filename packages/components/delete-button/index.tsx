/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import type { Dashicon } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

import { ConfirmationDialog } from '../confirmation-dialog';

export type DeleteButtonProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly icon?: Dashicon.Props[ 'icon' ];
	readonly size?: Button.Props[ 'size' ];
	readonly isDeleting?: boolean;
	readonly onClick: () => void;
	readonly labels?: Partial< {
		readonly delete: string;
		readonly deleting: string;
	} >;
	readonly confirmationLabels?: Partial< {
		readonly title: string;
		readonly text: string;
	} >;
};

export const DeleteButton = ( {
	className = '',
	disabled = false,
	icon,
	size,
	isDeleting = false,
	onClick = () => void null,
	labels,
	confirmationLabels,
}: DeleteButtonProps ): JSX.Element => {
	const [ isConfirmationVisible, showConfirmation ] = useState( false );

	const deleteLabel =
		labels?.delete || _x( 'Delete', 'command', 'nelio-content' );
	const deletingLabel =
		labels?.deleting || _x( 'Deleting…', 'text', 'nelio-content' );
	const title =
		confirmationLabels?.title || _x( 'Delete', 'text', 'nelio-content' );
	const text =
		confirmationLabels?.text ||
		_x(
			'Are you sure you want to delete this item? This operation can’t be undone.',
			'user',
			'nelio-content'
		);

	return (
		<>
			<Button
				className={ classnames( {
					[ className ]: true,
					'nelio-content-delete-button': true,
					'nelio-content-delete-button--is-deleting': isDeleting,
				} ) }
				variant="link"
				isDestructive
				icon={ icon }
				size={ size }
				disabled={ disabled || isDeleting }
				onClick={ () => showConfirmation( true ) }
			>
				{ isDeleting ? ! icon && deletingLabel : ! icon && deleteLabel }
			</Button>
			<ConfirmationDialog
				isOpen={ isConfirmationVisible }
				confirmLabel={ deleteLabel }
				onConfirm={ () => {
					showConfirmation( false );
					onClick();
				} }
				onCancel={ () => showConfirmation( false ) }
				text={ text }
				title={ title }
			/>
		</>
	);
};
