/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter } from 'lodash';
import type { FSProduct } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from './store';
import type { DialogName, LockReason } from './store/types';

export const useDialog = (
	name: DialogName
): [ boolean, ( v: boolean ) => void ] => {
	const isVisible = useSelect( ( select ) =>
		select( NC_ACCOUNT ).isDialogOpen( name )
	);

	const { openDialog, closeDialog } = useDispatch( NC_ACCOUNT );
	const setVisible = ( v: boolean ) =>
		v ? openDialog( name ) : closeDialog();
	return [ isVisible, setVisible ];
};

export const useIsLocked = ( reason?: LockReason ): boolean =>
	useSelect( ( select ) => select( NC_ACCOUNT ).isLocked( reason ) );

export const useUpgradeableProducts = (): ReadonlyArray< FSProduct > =>
	useSelect( ( select ) => {
		const { getAccount } = select( NC_ACCOUNT );
		const account = getAccount();
		if ( 'free' === account.plan ) {
			return [];
		} //end if
		const { getProducts } = select( NC_ACCOUNT );
		return filter( getProducts(), ( { upgradeableFrom } ) =>
			upgradeableFrom.includes( account.productId )
		);
	} );
