/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
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
import type { DialogName, LockReason, State } from './types';

export function getSiteId( state: State ): Uuid {
	return state.info.siteId;
} //end getSiteId()

export function isDialogOpen( state: State, dialogName: DialogName ): boolean {
	return state.meta.dialog === dialogName;
} //end isDialogOpen()

export function isLocked( state: State, reason?: LockReason ): boolean {
	return isEmpty( reason )
		? ! isEmpty( state.meta.lockReason )
		: reason === state.meta.lockReason;
} //end isLocked()

export function getEditingLicense( state: State ): License {
	return state.meta.editingLicense;
} //end getEditingLicense()

export function getAccount( state: State ): Account {
	return state.info;
} //end getAccount()

export function getInvoices( state: State ): ReadonlyArray< Invoice > {
	return state.invoices;
} //end getInvoices()

export function getProducts( state: State ): ReadonlyArray< FSProduct > {
	return state.products;
} //end getProducts()

export function getSites( state: State ): ReadonlyArray< Site > {
	return state.sites || [];
} //end getSites()

export function isAgencySummary( state: State ): boolean {
	return state.meta.isAgencySummary;
} //end isAgencySummary()
