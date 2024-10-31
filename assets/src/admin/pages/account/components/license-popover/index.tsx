/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, TextControl, Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { useIsLocked } from '~/nelio-content-pages/account/hooks';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

const LICENSE_LENGTH = 21;
const OLD_LICENSE_LENGTH = 26;

export type LicensePopoverProps = {
	readonly isOpen: boolean;
	readonly placement: Required< Popover.Props >[ 'placement' ];
	readonly onFocusOutside?: () => void;
};

export const LicensePopover = ( {
	isOpen,
	onFocusOutside,
	placement,
}: LicensePopoverProps ): JSX.Element | null => {
	const [ license, setLicense ] = useLicense();
	const isLocked = useIsLocked();
	const isApplyingLicense = useIsLocked( 'apply-license' );
	const { applyLicense } = useDispatch( NC_ACCOUNT );

	if ( ! isOpen ) {
		return null;
	} //end if

	return (
		<Popover
			placement={ placement }
			onFocusOutside={
				! isLocked && onFocusOutside ? onFocusOutside : undefined
			}
		>
			<div className="nelio-content-license-form">
				<TextControl
					value={ license }
					placeholder={ _x(
						'Type your license here',
						'user',
						'nelio-content'
					) }
					maxLength={ Math.max( LICENSE_LENGTH, OLD_LICENSE_LENGTH ) }
					className="nelio-content-license-form__text-control"
					disabled={ isLocked }
					onChange={ setLicense }
				/>
				<Button
					variant="primary"
					isBusy={ isApplyingLicense }
					className="nelio-content-license-form__button"
					disabled={
						isLocked ||
						( license.length !== LICENSE_LENGTH &&
							license.length !== OLD_LICENSE_LENGTH )
					}
					onClick={ () => applyLicense( license ) }
				>
					{ isApplyingLicense
						? _x( 'Applying…', 'text', 'nelio-content' )
						: _x( 'Apply', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</Popover>
	);
};

// =====
// HOOKS
// =====

const useLicense = () => {
	const license = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getEditingLicense()
	);
	const { setEditingLicense } = useDispatch( NC_ACCOUNT );
	return [ license, setEditingLicense ] as const;
};
