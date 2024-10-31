/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { EditorialComment, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export async function createEditorialComment(
	comment: EditorialComment
): Promise< void > {
	await dispatch( NC_DATA ).receiveComments( comment );

	await dispatch( NC_EDIT_POST ).markEditorialCommentAsSynching(
		comment.id,
		true
	);

	try {
		const apiRoot = select( NC_DATA ).getApiRoot();
		const siteId = select( NC_DATA ).getSiteId();
		const token = select( NC_DATA ).getAuthenticationToken();
		const newComment = await apiFetch< EditorialComment >( {
			url: `${ apiRoot }/site/${ siteId }/comment`,
			method: 'POST',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: comment,
		} );

		await dispatch( NC_DATA ).receiveComments( newComment );

		try {
			await apiFetch( {
				path: '/nelio-content/v1/notifications/comment',
				method: 'POST',
				data: newComment,
			} );
		} catch ( _ ) {}
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_DATA ).removeComment( comment.id );
	} //end catch

	await dispatch( NC_EDIT_POST ).markEditorialCommentAsSynching(
		comment.id,
		false
	);
} //end createEditorialComment()

export async function deleteEditorialComment(
	commentId: Uuid
): Promise< void > {
	const comment = select( NC_DATA ).getComment( commentId );
	if ( ! comment ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markEditorialCommentAsDeleting(
		commentId,
		true
	);

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		await apiFetch( {
			url: `${ apiRoot }/site/${ siteId }/comment/${ commentId }`,
			method: 'DELETE',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).removeComment( commentId );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_EDIT_POST ).markEditorialCommentAsDeleting(
		commentId,
		false
	);
} //end deleteEditorialComment()
