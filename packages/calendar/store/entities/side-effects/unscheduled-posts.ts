/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { map, trim } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { PaginatedResults, Post } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../../store';

export async function loadUnscheduledPosts( query = '' ): Promise< void > {
	query = trim( query );

	await dispatch( NC_CALENDAR ).setUnscheduledPostsSearchTimeout( 0 );

	const areTherePostsToLoad =
		select( NC_CALENDAR ).areThereUnscheduledPostsToLoad( query );
	if ( ! areTherePostsToLoad ) {
		return;
	} //end if

	const isLoadingUnscheduledPosts =
		select( NC_CALENDAR ).isLoadingUnscheduledPosts( query );
	if ( isLoadingUnscheduledPosts ) {
		return;
	} //end if

	try {
		await dispatch( NC_CALENDAR ).setIsLoadingUnscheduledPosts(
			query,
			true
		);

		const lastPageLoaded =
			select( NC_CALENDAR ).getLastLoadedPageInUnscheduled( query );
		const postTypes = map(
			select( NC_DATA ).getPostTypes( 'calendar' ),
			'name'
		);

		const response = await apiFetch<
			PaginatedResults< ReadonlyArray< Post > >
		>( {
			path: addQueryArgs( '/nelio-content/v1/post/search', {
				page: lastPageLoaded + 1,
				per_page: 15,
				query,
				status: 'nc_unscheduled',
				type: postTypes.join( ',' ),
			} ),
			method: 'GET',
		} );

		const posts = response.results;
		await dispatch( NC_DATA ).receivePosts( posts );

		await dispatch( NC_CALENDAR ).updateUnscheduledPostsPagination(
			query,
			lastPageLoaded + 1,
			response.pagination.pages
		);
		await dispatch( NC_CALENDAR ).setIsLoadingUnscheduledPosts(
			query,
			false
		);
	} catch ( error ) {
		await showErrorNotice( error );
	} //end catch
} //end loadUnscheduledPosts()
