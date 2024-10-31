/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { UpgradePopover } from '../upgrade-popover';
import {
	useIsLocked,
	useUpgradeableProducts,
} from '~/nelio-content-pages/account/hooks';

export const UpgradeSubscription = (): JSX.Element | null => {
	const [ isOpen, setIsOpen ] = useState( false );
	const isLocked = useIsLocked();
	const isUpgrading = useIsLocked( 'upgrade-subscription' );

	const products = useUpgradeableProducts();

	if ( ! products.length ) {
		return null;
	} //end if

	return (
		<div>
			<Button
				variant="primary"
				isBusy={ isUpgrading }
				onClick={ () => setIsOpen( true ) }
				disabled={ isLocked }
			>
				{ isUpgrading
					? _x( 'Upgrading…', 'text', 'nelio-content' )
					: _x( 'Upgrade Subscription', 'command', 'nelio-content' ) }
			</Button>

			<UpgradePopover
				isOpen={ isOpen }
				placement="bottom"
				onFocusOutside={ () => setIsOpen( false ) }
				onUpgrade={ () => setIsOpen( false ) }
			/>
		</div>
	);
};
