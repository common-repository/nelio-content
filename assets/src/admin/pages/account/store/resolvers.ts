/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { showErrorNotice } from '@nelio-content/utils';
import type { Account, Invoice, Site, FSProduct } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from '../store';

export async function getAccount(): Promise< void > {
	const account = await apiFetch< Account >( {
		path: '/nelio-content/v1/site',
	} );
	await dispatch( NC_ACCOUNT ).receiveAccount( account );
} //end getAccount()

export async function getInvoices(): Promise< void > {
	try {
		const invoices = await apiFetch< ReadonlyArray< Invoice > >( {
			path: '/nelio-content/v1/subscription/invoices',
		} );
		await dispatch( NC_ACCOUNT ).receiveInvoices( invoices );
	} catch ( e ) {
		await showErrorNotice(
			e,
			_x( 'Error while retrieving notices', 'text', 'nelio-content' )
		);
		await dispatch( NC_ACCOUNT ).receiveInvoices( [] );
	} //end catch
} //end getInvoices()

export async function getSites(): Promise< void > {
	try {
		const sites = await apiFetch< ReadonlyArray< Site > >( {
			path: '/nelio-content/v1/subscription/sites',
		} );
		await dispatch( NC_ACCOUNT ).receiveSites( sites );
	} catch ( e ) {
		await showErrorNotice(
			e,
			_x( 'Error while retrieving sites', 'text', 'nelio-content' )
		);
		await dispatch( NC_ACCOUNT ).receiveSites( [] );
	} //end catch
} //end getSites()

export async function getProducts(): Promise< void > {
	try {
		const products = await apiFetch< ReadonlyArray< FSProduct > >( {
			path: '/nelio-content/v1/products',
		} );
		await dispatch( NC_ACCOUNT ).receiveProducts( products );
	} catch ( e ) {
		await showErrorNotice(
			e,
			_x( 'Error while retrieving plans', 'text', 'nelio-content' )
		);
		await dispatch( NC_ACCOUNT ).receiveProducts( [] );
	} //end catch
} //end getProducts()
