/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { useDialog, useIsLocked } from '~/nelio-content-pages/account/hooks';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export const RemoveLicenseAction = ( {
	label,
	...buttonProps
}: Button.Props ): JSX.Element => {
	const [ isVisible, setVisible ] = useDialog( 'remove-license' );

	const siteId = useSelect( ( select ) => select( NC_ACCOUNT ).getSiteId() );
	const isRemoving = useIsLocked( 'remove-license' );
	const isLocked = useIsLocked();
	const { removeLicense } = useDispatch( NC_ACCOUNT );

	return (
		<>
			<Button
				onClick={ () => setVisible( true ) }
				disabled={ isLocked }
				{ ...buttonProps }
			>
				{ label }
			</Button>

			<ConfirmationDialog
				title={ _x(
					'Downgrade to Free Version?',
					'text',
					'nelio-content'
				) }
				text={ _x(
					'This action will remove the license from this site so that you can use it somewhere else. Nelio Content will remain active on this site, but you will be using the free version instead. This might result in some scheduled social messages being lost. Do you want to continue?',
					'user',
					'nelio-content'
				) }
				confirmLabel={
					isRemoving
						? _x(
								'Downgrading…',
								'text (remove license)',
								'nelio-content'
						  )
						: _x(
								'Downgrade',
								'command (remove license)',
								'nelio-content'
						  )
				}
				cancelLabel={ _x( 'Back', 'command', 'nelio-content' ) }
				isDestructive
				onCancel={ () => setVisible( false ) }
				onConfirm={ () => void removeLicense( siteId ) }
				isConfirmEnabled={ ! isLocked }
				isCancelEnabled={ ! isLocked }
				isOpen={ isVisible }
				isConfirmBusy={ isRemoving }
			/>
		</>
	);
};
