/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../../store';
import { useIsSaving, useFailureDescription } from '../../../hooks';

export const ErrorDialog = (): JSX.Element => {
	const isSaving = useIsSaving();
	const error = useFailureDescription();

	const { close, makeEditable, sendNow } = useDispatch( NC_SOCIAL_EDITOR );

	return (
		<Modal
			className="nelio-content-social-message-error-dialog"
			title={ _x( 'Failed Social Message', 'text', 'nelio-content' ) }
			onRequestClose={ () => ! isSaving && close() }
		>
			<div className="nelio-content-social-message-error-dialog__content">
				{ isEmpty( error ) ? (
					<>
						{ _x(
							'An error occurred while attempting to share this social message.',
							'text',
							'nelio-content'
						) }
					</>
				) : (
					<>
						<strong>
							{ _x( 'Error!', 'text', 'nelio-content' ) }
						</strong>
						{ ` ${ error }` }
					</>
				) }
			</div>
			<div className="nelio-content-social-message-error-dialog__actions">
				<Button
					variant="secondary"
					onClick={ makeEditable }
					disabled={ isSaving }
				>
					{ _x( 'Edit', 'command', 'nelio-content' ) }
				</Button>
				<Button
					variant="primary"
					isBusy={ isSaving }
					onClick={ sendNow }
					disabled={ isSaving }
				>
					{ isSaving
						? _x( 'Saving…', 'text', 'nelio-content' )
						: _x( 'Send Now', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</Modal>
	);
};
