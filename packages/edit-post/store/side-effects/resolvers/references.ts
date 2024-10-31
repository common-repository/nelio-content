/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { logError } from '@nelio-content/utils';
import type { EditorialReference, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export async function getReferenceByUrl( referenceUrl: Url ): Promise< void > {
	if ( ! referenceUrl ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markReferenceAsLoading( referenceUrl, true );

	try {
		const reference = await apiFetch< EditorialReference >( {
			path: addQueryArgs( '/nelio-content/v1/reference/search', {
				url: referenceUrl,
			} ),
		} );

		await dispatch( NC_EDIT_POST ).receiveReferences( reference );

		const { status, isExternal } = reference;
		if ( 'pending' === status && isExternal ) {
			await loadExternalReferenceData( reference );
		} //end if
	} catch ( e ) {
		logError( e );
	} //end catch

	await dispatch( NC_EDIT_POST ).markReferenceAsLoading(
		referenceUrl,
		false
	);
} //end getReferenceByUrl()

async function loadExternalReferenceData(
	reference: EditorialReference
): Promise< void > {
	await dispatch( NC_DATA ).loadLink( reference.url );
	const data = select( NC_DATA ).getSharedLinkData( reference.url );
	if ( ! data ) {
		return;
	} //end if

	const { author, date, title, twitter } = data;
	const updatedReference = {
		...reference,
		author,
		date,
		title,
		twitter,
	};

	await dispatch( NC_EDIT_POST ).saveReference( updatedReference );
} //end loadExternalReferenceData()
