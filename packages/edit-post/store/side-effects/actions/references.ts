/**
 * WordPress references
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';

/**
 * External references
 */
import { omitBy } from 'lodash';
import { isEmpty, showErrorNotice } from '@nelio-content/utils';
import type { EditorialReference, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export async function openReferenceEditor(
	referenceUrl: Url
): Promise< void > {
	const reference =
		await resolveSelect( NC_EDIT_POST ).getReferenceByUrl( referenceUrl );
	if ( ! reference ) {
		return;
	} //end if
	await dispatch( NC_EDIT_POST ).doOpenReferenceEditor( reference );
} //end openReferenceEditor()

export async function saveAndCloseEditingReference(): Promise< void > {
	const reference = select( NC_EDIT_POST ).getEditingReference();
	if ( reference ) {
		await dispatch( NC_EDIT_POST ).saveReference( reference );
	} //end if
	await dispatch( NC_EDIT_POST ).closeReferenceEditor();
} //end saveAndCloseEditingReference()

export async function saveReference(
	reference: EditorialReference
): Promise< void > {
	await dispatch( NC_EDIT_POST ).markReferenceAsSaving( reference.url, true );

	try {
		const updatedReference = await apiFetch< EditorialReference >( {
			path: `/nelio-content/v1/reference/${ reference.id }`,
			method: 'PUT',
			data: omitBy( reference, isEmpty ),
		} );

		await dispatch( NC_EDIT_POST ).receiveReferences( updatedReference );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_EDIT_POST ).markReferenceAsSaving(
		reference.url,
		false
	);
} //end saveReference()
