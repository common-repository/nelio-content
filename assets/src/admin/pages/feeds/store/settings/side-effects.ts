/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { Feed, FeedId, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_FEEDS } from '../../store';

export async function addFeed( url: Url ): Promise< void > {
	await dispatch( NC_FEEDS ).markAsAddingFeed( true );

	try {
		const feed = await apiFetch< Feed >( {
			path: '/nelio-content/v1/feeds/',
			method: 'POST',
			data: { url },
		} );

		await dispatch( NC_DATA ).receiveFeeds( feed );
		await dispatch( NC_FEEDS ).setNewFeedUrl( '' );

		await dispatch( NC_FEEDS ).loadFeedItems( feed.id );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_FEEDS ).markAsAddingFeed( false );
} //end addFeed()

export async function saveFeed(
	feedId: FeedId,
	{ name, twitter }: Pick< Feed, 'name' | 'twitter' >
): Promise< void > {
	await dispatch( NC_FEEDS ).markAsSaving( true );

	try {
		const feed = await apiFetch< Feed >( {
			path: '/nelio-content/v1/feeds/',
			method: 'PUT',
			data: {
				id: feedId,
				name: name || undefined,
				twitter: twitter || undefined,
			},
		} );

		await dispatch( NC_DATA ).receiveFeeds( feed );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_FEEDS ).closeEditor();
	await dispatch( NC_FEEDS ).markAsSaving( false );
} //end saveFeed()

export async function deleteFeed( feedId: FeedId ): Promise< void > {
	await dispatch( NC_FEEDS ).markAsDeleting( feedId, true );

	try {
		await apiFetch( {
			path: addQueryArgs( '/nelio-content/v1/feeds/', { id: feedId } ),
			method: 'DELETE',
		} );

		await dispatch( NC_DATA ).removeFeed( feedId );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_FEEDS ).markAsDeleting( feedId, false );
} //end deleteFeed()
