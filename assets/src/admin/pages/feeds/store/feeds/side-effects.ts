/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { showErrorNotice } from '@nelio-content/utils';
import type { FeedId, FeedItem } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_FEEDS } from '../../store';

export async function loadFeedItems( feedId: FeedId ): Promise< void > {
	await dispatch( NC_FEEDS ).markFeedAsLoading( feedId, true );

	try {
		const items = await apiFetch< ReadonlyArray< FeedItem > >( {
			path: addQueryArgs( '/nelio-content/v1/feeds/items', {
				id: feedId,
			} ),
		} );
		await dispatch( NC_FEEDS ).receiveItems( feedId, items );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_FEEDS ).markFeedAsLoading( feedId, false );
	await dispatch( NC_FEEDS ).markFeedAsLoaded( feedId );
} //end loadFeedItems()
