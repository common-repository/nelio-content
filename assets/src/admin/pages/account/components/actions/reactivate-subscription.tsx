/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nelio-content/components';
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

const DATE_FORMAT = _x( 'Y-m-d', 'text (date)', 'nelio-content' );

export const ReactivateSubscriptionAction = (): JSX.Element => {
	const isLocked = useSelect( ( select ) => select( NC_ACCOUNT ).isLocked() );

	const isDialogVisible = useSelect( ( select ) =>
		select( NC_ACCOUNT ).isDialogOpen( 'reactivate-subscription' )
	);
	const isReactivating = useSelect( ( select ) =>
		select( NC_ACCOUNT ).isLocked( 'reactivate-subscription' )
	);
	const nextChargeDate = useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return account.plan === 'free' ? '' : account.nextChargeDate;
	} );

	const { reactivateSubscription, openDialog, closeDialog } =
		useDispatch( NC_ACCOUNT );

	return (
		<>
			<Button
				variant="primary"
				onClick={ () => openDialog( 'reactivate-subscription' ) }
				disabled={ isLocked }
			>
				{ _x( 'Reactivate Subscription', 'command', 'nelio-content' ) }
			</Button>

			<ConfirmationDialog
				title={ _x(
					'Reactivate Subscription?',
					'text',
					'nelio-content'
				) }
				text={ sprintf(
					/* translators: a date */
					_x(
						'Reactivating your subscription will cause it to renew on %s. Do you want to reactivate your subscription?',
						'user',
						'nelio-content'
					),
					dateI18n( DATE_FORMAT, nextChargeDate )
				) }
				confirmLabel={
					isReactivating
						? _x( 'Reactivating…', 'text', 'nelio-content' )
						: _x(
								'Reactivate Subscription',
								'command',
								'nelio-content'
						  )
				}
				cancelLabel={ _x( 'Back', 'command', 'nelio-content' ) }
				onCancel={ closeDialog }
				onConfirm={ reactivateSubscription }
				isConfirmEnabled={ ! isLocked }
				isCancelEnabled={ ! isLocked }
				isOpen={ isDialogVisible }
				isConfirmBusy={ isReactivating }
			/>
		</>
	);
};
