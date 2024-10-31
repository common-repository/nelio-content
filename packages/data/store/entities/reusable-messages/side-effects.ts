/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError, showErrorNotice } from '@nelio-content/utils';
import type {
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

type LoadReusableMessagesResponse = {
	readonly messages: ReadonlyArray< ReusableSocialMessage >;
	readonly status: 'all-loaded' | 'query-loaded' | 'more';
};

export async function loadReusableMessages( query: string ): Promise< void > {
	const status = select( NC_DATA ).getReusableMessageQueryStatus( query );
	if ( 'loaded' === status ) {
		return;
	} //end if

	await dispatch( NC_DATA ).setReusableMessageQueryStatus( query, 'loading' );
	try {
		const response = await apiFetch< LoadReusableMessagesResponse >( {
			path: '/nelio-content/v1/reusable-messages/search',
			method: 'POST',
			data: {
				query,
				exclude: select( NC_DATA )
					.getReusableMessages()
					.map( ( m ) => m.id ),
			},
		} );

		await dispatch( NC_DATA ).receiveReusableMessages( response.messages );
		if ( response.status === 'all-loaded' ) {
			await dispatch( NC_DATA ).markReusableMessagesAsFullyLoaded();
		} else {
			await dispatch( NC_DATA ).setReusableMessageQueryStatus(
				query,
				response.status === 'more' ? 'pending' : 'loaded'
			);
		} //end if
	} catch ( e ) {
		logError( e );
		await dispatch( NC_DATA ).setReusableMessageQueryStatus(
			query,
			'pending'
		);
	} //end catch
} //end doLoadReusableMessages()

export async function deleteReusableMessage(
	id: ReusableSocialMessageId
): Promise< void > {
	const message = await resolveSelect( NC_DATA ).getReusableMessage( id );
	if ( ! message ) {
		return;
	} //end if
	await dispatch( NC_DATA ).removeReusableMessage( message.id );

	try {
		await apiFetch< LoadReusableMessagesResponse >( {
			path: '/nelio-content/v1/reusable-message',
			method: 'DELETE',
			data: { id: message.id },
		} );
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_DATA ).receiveReusableMessages( message );
	} //end catch
} //end deleteReusableMessage()
