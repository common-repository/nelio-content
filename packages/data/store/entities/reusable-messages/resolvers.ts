/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError } from '@nelio-content/utils';
import type {
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getReusableMessage(
	id?: ReusableSocialMessageId
): Promise< void > {
	const message = select( NC_DATA ).getReusableMessage( id );
	if ( ! message ) {
		return;
	} //end if

	try {
		const response = await apiFetch< ReusableSocialMessage >( {
			path: '/nelio-content/v1/reusable-message',
			method: 'GET',
			data: { id: message.id },
		} );
		await dispatch( NC_DATA ).receiveReusableMessages( response );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getReusableMessage()
