/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export type ConfirmationDialogProps = {
	readonly title: string;
	readonly text: string;
	readonly className?: string;
	readonly cancelLabel?: string;
	readonly confirmLabel?: string;
	readonly isCancelEnabled?: boolean;
	readonly isConfirmBusy?: boolean;
	readonly isConfirmEnabled?: boolean;
	readonly isDestructive?: boolean;
	readonly isOpen?: boolean;
	readonly onCancel: () => void;
	readonly onConfirm: () => void;
};

export const ConfirmationDialog = ( {
	isOpen,
	className,
	title,
	onCancel,
	onConfirm,
	isDestructive,
	text,
	confirmLabel = _x( 'OK', 'command', 'nelio-content' ),
	cancelLabel = _x( 'Cancel', 'command', 'nelio-content' ),
	isConfirmBusy,
	isConfirmEnabled = true,
	isCancelEnabled = true,
}: ConfirmationDialogProps ): JSX.Element | null => {
	if ( ! isOpen ) {
		return null;
	} //end if

	return (
		<Modal
			className={ classnames(
				'nelio-content-confirmation-dialog',
				className
			) }
			title={ title }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<p>{ text }</p>
			<div className="nelio-content-confirmation-dialog__actions">
				<Button
					variant="secondary"
					disabled={ ! isCancelEnabled }
					className="nelio-content-confirmation-dialog__cancel-action"
					onClick={ onCancel }
				>
					{ cancelLabel }
				</Button>
				<Button
					variant={ ! isDestructive ? 'primary' : undefined }
					isBusy={ isConfirmBusy }
					isDestructive={ isDestructive }
					disabled={ ! isConfirmEnabled }
					className="nelio-content-confirmation-dialog__confirm-action"
					onClick={ onConfirm }
				>
					{ confirmLabel }
				</Button>
			</div>
		</Modal>
	);
};
