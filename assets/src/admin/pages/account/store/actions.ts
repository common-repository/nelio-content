/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	Account,
	FSProduct,
	Invoice,
	License,
	Site,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { DialogName, LockReason } from './types';

export type Action =
	| ReceiveAccountAction
	| ReceiveSitesAction
	| RemoveSiteAction
	| ReceiveInvoicesAction
	| ReceiveProductsAction
	| OpenDialogAction
	| CloseDialogAction
	| LockAction
	| UnlockAction
	| SetEditingLicenseAction
	| EnableAgencyFullViewAction;

export function receiveAccount( account: Account ): ReceiveAccountAction {
	return {
		type: 'RECEIVE_ACCOUNT',
		account,
	};
} //end receiveAccount()

export function receiveSites(
	sites: Site | ReadonlyArray< Site >
): ReceiveSitesAction {
	return {
		type: 'RECEIVE_SITES',
		sites: castArray( sites ),
	};
} //end receiveSites()

export function removeSite( siteId: Uuid ): RemoveSiteAction {
	return {
		type: 'REMOVE_SITE',
		siteId,
	};
} //end removeSite()

export function receiveInvoices(
	invoices: Invoice | ReadonlyArray< Invoice >
): ReceiveInvoicesAction {
	return {
		type: 'RECEIVE_INVOICES',
		invoices: castArray( invoices ),
	};
} //end receiveInvoices()

export function receiveProducts(
	products: FSProduct | ReadonlyArray< FSProduct >
): ReceiveProductsAction {
	return {
		type: 'RECEIVE_PRODUCTS',
		products: castArray( products ),
	};
} //end receiveProducts()

export function openDialog( dialogName: DialogName ): OpenDialogAction {
	return {
		type: 'OPEN_DIALOG',
		dialogName,
	};
} //end openDialog()

export function closeDialog(): CloseDialogAction {
	return {
		type: 'CLOSE_DIALOG',
	};
} //end closeDialog()

export function lock( reason: LockReason = 'no-reason' ): LockAction {
	return {
		type: 'LOCK_PAGE',
		reason,
	};
} //end lock()

export function unlock(): UnlockAction {
	return {
		type: 'UNLOCK_PAGE',
	};
} //end unlock()

export function setEditingLicense( license: License ): SetEditingLicenseAction {
	return {
		type: 'SET_EDITING_LICENSE',
		license,
	};
} //end setEditingLicense()

export function enableAgencyFullView(): EnableAgencyFullViewAction {
	return {
		type: 'ENABLE_AGENCY_FULL_VIEW',
	};
} //end enableAgencyFullView()

// ============
// HELPER TYPES
// ============

type ReceiveAccountAction = {
	readonly type: 'RECEIVE_ACCOUNT';
	readonly account: Account;
};

type ReceiveSitesAction = {
	readonly type: 'RECEIVE_SITES';
	readonly sites: ReadonlyArray< Site >;
};

type RemoveSiteAction = {
	readonly type: 'REMOVE_SITE';
	readonly siteId: Uuid;
};

type ReceiveInvoicesAction = {
	readonly type: 'RECEIVE_INVOICES';
	readonly invoices: ReadonlyArray< Invoice >;
};

type ReceiveProductsAction = {
	readonly type: 'RECEIVE_PRODUCTS';
	readonly products: ReadonlyArray< FSProduct >;
};

type OpenDialogAction = {
	readonly type: 'OPEN_DIALOG';
	readonly dialogName: DialogName;
};

type CloseDialogAction = {
	readonly type: 'CLOSE_DIALOG';
};

type LockAction = {
	readonly type: 'LOCK_PAGE';
	readonly reason: LockReason;
};

type UnlockAction = {
	readonly type: 'UNLOCK_PAGE';
};

type SetEditingLicenseAction = {
	readonly type: 'SET_EDITING_LICENSE';
	readonly license: License;
};

type EnableAgencyFullViewAction = {
	readonly type: 'ENABLE_AGENCY_FULL_VIEW';
};
