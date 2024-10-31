/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { resolveSelect, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { MediaId, MediaLibraryItem } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getMedia( mediaId?: MediaId ): Promise< void > {
	if ( ! mediaId ) {
		return;
	} //end if

	const isMedia = ( m: unknown ): m is MediaLibraryItem => !! m;
	const maybeMedia = await resolveSelect( CORE ).getEntityRecord(
		'root',
		'media',
		mediaId
	);
	if ( ! isMedia( maybeMedia ) ) {
		return;
	} //end if

	await dispatch( NC_DATA ).receiveMediaLibraryItem( maybeMedia );
} //end getMedia()
