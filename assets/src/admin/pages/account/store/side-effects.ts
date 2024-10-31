/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { showErrorNotice } from '@nelio-content/utils';
import type { FSProductId, License, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from '../store';

export async function createFreeSite(): Promise< void > {
	try {
		await apiFetch( {
			path: '/nelio-content/v1/site/free',
			method: 'POST',
		} );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end createFreeSite()

export async function applyLicense( license: License ): Promise< void > {
	try {
		void dispatch( NC_ACCOUNT ).lock( 'apply-license' );

		await apiFetch( {
			path: '/nelio-content/v1/site/use-license',
			method: 'POST',
			data: { license },
		} );

		window.location.reload();
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_ACCOUNT ).unlock();
		await dispatch( NC_ACCOUNT ).closeDialog();
	} //end catch
} //end applyLicense()

export async function removeLicense( siteId: Uuid ): Promise< void > {
	try {
		await dispatch( NC_ACCOUNT ).lock( 'remove-license' );

		await apiFetch( {
			path: '/nelio-content/v1/site/remove-license',
			method: 'POST',
			data: { siteId },
		} );

		const thisSiteId = select( NC_ACCOUNT ).getSiteId();
		if ( thisSiteId === siteId ) {
			window.location.reload();
			return;
		}

		await dispatch( NC_ACCOUNT ).removeSite( siteId );
		//end if
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_ACCOUNT ).unlock();
		await dispatch( NC_ACCOUNT ).closeDialog();
	} //end catch
} //end removeLicense()

/**
 * Cancels the subscription and reloads the page.
 */
export async function cancelSubscription(): Promise< void > {
	try {
		await dispatch( NC_ACCOUNT ).lock( 'cancel-subscription' );

		await apiFetch( {
			path: '/nelio-content/v1/subscription',
			method: 'DELETE',
		} );

		window.location.reload();
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_ACCOUNT ).unlock();
		await dispatch( NC_ACCOUNT ).closeDialog();
	} //end catch
} //end cancelSubscription()

/**
 * Reactivates the subscription and reloads the page.
 */
export async function reactivateSubscription(): Promise< void > {
	try {
		await dispatch( NC_ACCOUNT ).lock( 'reactivate-subscription' );

		await apiFetch( {
			path: '/nelio-content/v1/subscription/uncancel',
			method: 'POST',
		} );

		window.location.reload();
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_ACCOUNT ).unlock();
		await dispatch( NC_ACCOUNT ).closeDialog();
	} //end catch
} //end reactivateSubscription()

export async function upgradeSubscription(
	product: FSProductId
): Promise< void > {
	try {
		await dispatch( NC_ACCOUNT ).lock( 'upgrade-subscription' );

		await apiFetch( {
			path: `/nelio-content/v1/subscription/upgrade`,
			method: 'PUT',
			data: { product },
		} );

		window.location.reload();
	} catch ( e ) {
		await dispatch( NC_ACCOUNT ).unlock();
		await showErrorNotice( e );
	}
} //end upgradeSubscription()
