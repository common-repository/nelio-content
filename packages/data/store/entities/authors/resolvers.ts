/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError } from '@nelio-content/utils';
import type { Author, AuthorId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getAuthor( authorId?: AuthorId ): Promise< void > {
	if ( ! authorId ) {
		return;
	} //end if

	try {
		const author = await apiFetch< Author >( {
			path: `/nelio-content/v1/author/${ authorId }`,
		} );
		await dispatch( NC_DATA ).receiveAuthors( author );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getAuthor()
