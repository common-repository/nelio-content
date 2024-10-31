/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	Maybe,
	MediaItem,
	MediaLibraryItem,
	MediaUploadItem,
} from '@nelio-content/types';

export type MediaAction = ReceiveMediaItemsAction;

export function receiveMediaLibraryItem(
	item: Maybe< MediaLibraryItem >
): Maybe< ReceiveMediaItemsAction > {
	if ( ! item ) {
		return;
	} //end if

	return receiveMediaItems( {
		id: item.id,
		duration: item.media_details.length ?? 0,
		filesizeInBytes: item.media_details.filesize ?? 0,
		height: item.media_details.height,
		mime: item.mime_type,
		url: item.source_url,
		width: item.media_details.width,
	} );
} //end receiveMediaLibraryItem()

export function receiveMediaUploadItem(
	item: Maybe< MediaUploadItem >
): Maybe< ReceiveMediaItemsAction > {
	if ( ! item ) {
		return;
	} //end if

	return receiveMediaItems( {
		id: item.id,
		duration: seconds( item.fileLength ),
		filesizeInBytes: item.filesizeInBytes,
		height: item.height,
		mime: item.mime,
		url: item.url,
		width: item.width,
	} );
} //end receiveMediaUploadItem()

export function receiveMediaItems(
	items: MediaItem | ReadonlyArray< MediaItem >
): ReceiveMediaItemsAction {
	return {
		type: 'RECEIVE_MEDIA',
		items: castArray( items ),
	};
} //end receiveMediaItems()

// ============
// HELPER TYPES
// ============

type ReceiveMediaItemsAction = {
	readonly type: 'RECEIVE_MEDIA';
	readonly items: ReadonlyArray< MediaItem >;
};

// =======
// HELPERS
// =======

const seconds = ( length = '' ): number => {
	try {
		const [ s = 0, m = 0, h = 0 ] = length
			.split( ':' )
			.reverse()
			.map( ( x ) => Number.parseInt( x ) );
		return s + m * 60 + h * 3600;
	} catch ( _ ) {
		return 0;
	} //end catch
};
