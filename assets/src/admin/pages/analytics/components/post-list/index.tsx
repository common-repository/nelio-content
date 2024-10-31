/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingAnimation } from '@nelio-content/components';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_ANALYTICS } from '~/nelio-content-pages/analytics/store';
import { Post } from './post';

export const PostList = (): JSX.Element | null => {
	const isLoading = useIsLoading();
	const isPeriodIncomplete = useIsPeriodIncomplete();
	const postIds = usePostIds();

	const hasMore = ! useArePostsFullyLoaded();
	const { loadPosts } = useDispatch( NC_ANALYTICS );

	if ( isPeriodIncomplete ) {
		return null;
	} //end if

	if ( isLoading && isEmpty( postIds ) ) {
		return (
			<div className="nelio-content-analytics-post-list">
				<LoadingAnimation />
			</div>
		);
	} //end if

	if ( isEmpty( postIds ) ) {
		return (
			<div className="nelio-content-analytics-post-list nelio-content-analytics-post-list--empty-list">
				<Dashicon
					className="nelio-content-analytics-post-list__no-posts-icon"
					icon="info"
				/>
				<div className="nelio-content-analytics-post-list__no-posts-message">
					{ _x(
						'No posts matched your criteria',
						'text',
						'nelio-content'
					) }
				</div>
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-analytics-post-list">
			{ postIds.map( ( postId ) => (
				<Post key={ postId } postId={ postId } />
			) ) }

			<div className="nelio-content-analytics-post-list__action">
				{ hasMore && (
					<Button
						disabled={ isLoading }
						isBusy={ isLoading }
						variant="secondary"
						onClick={ loadPosts }
					>
						{ isLoading
							? _x( 'Loading…', 'text', 'nelio-content' )
							: _x( 'Load More', 'command', 'nelio-content' ) }
					</Button>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostIds = () =>
	useSelect( ( select ) => select( NC_ANALYTICS ).getPostIds() || [] );

const useIsLoading = () =>
	useSelect( ( select ) => select( NC_ANALYTICS ).isLoadingPosts() );

const useIsPeriodIncomplete = () =>
	useSelect( ( select ) => {
		const { getFilterCriteria } = select( NC_ANALYTICS );
		const { periodMode, periodValue } = getFilterCriteria();
		const { from, to } = periodValue || {};
		return 'custom' === periodMode && ( ! from || ! to );
	} );

const useArePostsFullyLoaded = () =>
	useSelect( ( select ) => select( NC_ANALYTICS ).arePostsFullyLoaded() );
