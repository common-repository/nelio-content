/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError } from '@nelio-content/utils';
import type { EditorialReference, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getSuggestedReferences(
	postId?: PostId
): Promise< void > {
	if ( ! postId ) {
		return;
	} //end if

	try {
		const references = await apiFetch<
			ReadonlyArray< EditorialReference >
		>( {
			path: `/nelio-content/v1/post/${ postId }/references`,
		} );

		await dispatch( NC_DATA ).receiveSuggestedReferences(
			postId,
			references
		);
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getSuggestedReferences()
