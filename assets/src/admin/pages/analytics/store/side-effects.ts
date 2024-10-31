/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { PaginatedResults, Post } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_ANALYTICS } from '../store';

export async function loadPosts(): Promise< void > {
	const criteria = select( NC_ANALYTICS ).getFilterCriteria();

	const { periodMode, periodValue: period } = criteria;
	if ( 'custom' === periodMode ) {
		if ( ! period.from || ! period.to ) {
			return;
		} //end if
	} //end if

	const isFullyLoaded =
		select( NC_ANALYTICS ).arePostsWithCriteriaFullyLoaded( criteria );
	if ( isFullyLoaded ) {
		return;
	} //end if

	const isLoading =
		select( NC_ANALYTICS ).isLoadingPostsWithCriteria( criteria );
	if ( isLoading ) {
		return;
	} //end if

	await dispatch( NC_ANALYTICS ).markFilterCriteriaAsLoading(
		criteria,
		true
	);

	const page = select( NC_ANALYTICS ).getNextPageToLoad( criteria );

	try {
		const { sortBy: sortByCriterion, author, postType: type } = criteria;

		const result = await apiFetch<
			PaginatedResults< ReadonlyArray< Post > >
		>( {
			path: addQueryArgs( '/nelio-content/v1/analytics/top-posts', {
				sortBy: sortByCriterion,
				from: period.from || undefined,
				to: period.to || undefined,
				author: author ? author : undefined,
				postType: '_nc-all' !== type ? type : undefined,
				perPage: 10,
				page,
			} ),
		} );

		await dispatch( NC_DATA ).receivePosts( result.results );
		await dispatch( NC_ANALYTICS ).receivePostsMatchingCriteria(
			criteria,
			result.results
		);

		await dispatch( NC_ANALYTICS ).updateFilterCriteriaPagination(
			criteria,
			{
				lastLoadedPage: page,
				isFullyLoaded: ! result.pagination.more,
			}
		);
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_ANALYTICS ).markFilterCriteriaAsLoading(
		criteria,
		false
	);
} //end loadPosts()
