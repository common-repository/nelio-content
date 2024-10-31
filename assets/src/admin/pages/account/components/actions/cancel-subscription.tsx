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
import { useDialog, useIsLocked } from '~/nelio-content-pages/account/hooks';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

const DATE_FORMAT = _x( 'Y-m-d', 'text (date)', 'nelio-content' );

export const CancelSubscriptionAction = (): JSX.Element => {
	const [ isVisible, setVisible ] = useDialog( 'cancel-subscription' );

	const isCanceling = useIsLocked( 'cancel-subscription' );
	const isLocked = useIsLocked();
	const nextChargeDate = useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return account.plan === 'free' ? '' : account.nextChargeDate;
	} );

	const { cancelSubscription } = useDispatch( NC_ACCOUNT );

	return (
		<>
			<Button
				variant="tertiary"
				isDestructive
				onClick={ () => setVisible( true ) }
				disabled={ isLocked }
			>
				{ _x( 'Cancel Subscription', 'command', 'nelio-content' ) }
			</Button>

			<ConfirmationDialog
				title={ _x( 'Cancel Subscription?', 'text', 'nelio-content' ) }
				text={ sprintf(
					/* translators: a date */
					_x(
						'Canceling your subscription will cause it not to renew. If you cancel your subscrition, it will continue until %s. Then, the subscription will expire and will not be invoiced again. Do you want to cancel your subscription?',
						'user',
						'nelio-content'
					),
					dateI18n( DATE_FORMAT, nextChargeDate )
				) }
				confirmLabel={
					isCanceling
						? _x( 'Canceling…', 'text', 'nelio-content' )
						: _x(
								'Cancel Subscription',
								'command',
								'nelio-content'
						  )
				}
				cancelLabel={ _x( 'Back', 'command', 'nelio-content' ) }
				isDestructive
				onCancel={ () => setVisible( false ) }
				onConfirm={ cancelSubscription }
				isConfirmEnabled={ ! isLocked }
				isCancelEnabled={ ! isLocked }
				isOpen={ isVisible }
				isConfirmBusy={ isCanceling }
			/>
		</>
	);
};
