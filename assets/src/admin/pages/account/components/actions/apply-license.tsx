/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import { LicensePopover } from '../license-popover';
import { useDialog, useIsLocked } from '~/nelio-content-pages/account/hooks';

export const ApplyLicenseAction = ( {
	label,
	...buttonProps
}: Button.Props ): JSX.Element => {
	const [ isVisible, setVisible ] = useDialog( 'license-popover' );
	const isLocked = useIsLocked();

	return (
		<span>
			<Button
				disabled={ isLocked }
				onClick={ () => setVisible( true ) }
				{ ...buttonProps }
			>
				{ label }
			</Button>
			<LicensePopover
				placement="bottom"
				onFocusOutside={ () => setVisible( false ) }
				isOpen={ isVisible }
			/>
		</span>
	);
};
