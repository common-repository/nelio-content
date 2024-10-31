/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { mapValues } from 'lodash';
import { logError } from '@nelio-content/utils';
import type { Url, SharedLink } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function loadLink( url: Url ): Promise< void > {
	const link = select( NC_DATA ).getSharedLinkStatus( url );
	if ( link ) {
		return;
	} //end if

	try {
		await dispatch( NC_DATA ).markSharedLinkAsLoading( url );
		const linkData = await apiFetch< SharedLink >( {
			path: addQueryArgs( '/nelio-content/v1/shared-link', { url } ),
			method: 'GET',
		} );

		const element = document.createElement( 'div' );
		const result = mapValues( linkData, ( value ) => {
			element.innerHTML = `${ value }`;
			return element.textContent || element.innerText || value;
		} ) as SharedLink;

		await dispatch( NC_DATA ).receiveSharedLinkData( url, result );
	} catch ( e ) {
		logError( e );
		await dispatch( NC_DATA ).markSharedLinkAsError( url );
	} //end catch
} //end loadLink()
