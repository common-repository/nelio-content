/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import { useDrop } from 'react-dnd';
import {
	store as NC_CALENDAR,
	useCanCreatePosts,
	useNewPostLabel,
	usePostCreator,
} from '@nelio-content/calendar';

import { store as NC_DATA } from '@nelio-content/data';
import type { DraggableItemSummary, PostSummary } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { Searcher as UnscheduledPostSearcher } from './searcher';
import { Item } from '../../grid/item';

export type UnscheduledPostsProps = {
	readonly className?: string;
};

export const UnscheduledPosts = ( {
	className = '',
}: UnscheduledPostsProps ): JSX.Element => {
	const items = useUnscheduledItems();
	const { isLoading, isFirstPageLoaded, areTherePostsToLoad } =
		usePaginationInfo();

	const loadMorePosts = usePostLoader();
	const unschedule = usePostUnscheduler();

	const [ { isHovered }, drop ] = useDrop<
		DraggableItemSummary,
		unknown,
		{ isHovered: boolean }
	>( {
		accept: [ 'post' ],
		drop: unschedule,
		collect: ( monitor ) => ( {
			isHovered: monitor.canDrop() && monitor.isOver(),
		} ),
	} );

	const newPostLabel = useNewPostLabel();
	const canCreatePosts = useCanCreatePosts();
	const openNewPostEditor = usePostCreator( '', '' );

	return (
		<div
			className={ classnames( {
				'nelio-content-unscheduled-posts': true,
				'nelio-content-unscheduled-posts--is-hovered': isHovered,
				[ className ]: true,
			} ) }
			ref={ drop }
		>
			<div className="nelio-content-unscheduled-posts__title">
				<div>
					{ _x( 'Unscheduled', 'text (posts)', 'nelio-content' ) }
				</div>
			</div>

			<div className="nelio-content-unscheduled-posts__actions">
				<Button
					className="nelio-content-unscheduled-posts__header-button nelio-content-unscheduled-posts__add-item-icon"
					icon="insert"
				/>

				<Button
					className="nelio-content-unscheduled-posts__header-button nelio-content-unscheduled-posts__add-post"
					icon="admin-post"
					disabled={ ! canCreatePosts }
					label={ newPostLabel }
					tooltipPosition="bottom center"
					onClick={ openNewPostEditor }
				/>
			</div>

			<UnscheduledPostSearcher className="nelio-content-unscheduled-posts__searcher" />

			<div className="nelio-content-unscheduled-posts__list">
				{ items.map( ( item ) => (
					<Item
						key={ `${ item.type }-${ item.id }` }
						itemId={ item.id }
						itemType={ item.type }
					/>
				) ) }

				{ isFirstPageLoaded && areTherePostsToLoad && (
					<div className="nelio-content-unscheduled-posts__load-more-action">
						<Button
							variant="secondary"
							isBusy={ isLoading }
							disabled={ isLoading }
							onClick={ loadMorePosts }
						>
							{ isLoading
								? _x( 'Loading…', 'text', 'nelio-content' )
								: _x(
										'Load More',
										'command',
										'nelio-content'
								  ) }
						</Button>
					</div>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useUnscheduledQuery = () =>
	useSelect(
		( select ) =>
			select( NC_CALENDAR ).getUnscheduledPostsSearchQuery() || ''
	);

const useUnscheduledItems = () => {
	const unscheduledQuery = useUnscheduledQuery();
	return useSelect( ( select ) => {
		const { getPost, getUnscheduledPosts } = select( NC_DATA );
		const { isItemVisible } = select( NC_CALENDAR );

		const query = trim( unscheduledQuery.toLowerCase() );
		const items = getUnscheduledPosts();

		const isPostVisible = ( { id }: PostSummary ) => {
			const post = getPost( id );
			return !! post && isItemVisible( 'post', post );
		};

		const isPostValid = ( { id }: PostSummary ) => {
			const post = getPost( id );
			const title = post?.title ? post.title.toLowerCase() : '';
			return -1 !== title.indexOf( query ) || `${ id }` === query;
		};

		return ! query
			? items.filter( isPostVisible )
			: items.filter( isPostValid );
	} );
};

const usePaginationInfo = () => {
	const query = useUnscheduledQuery();
	return useSelect( ( select ) => {
		const {
			areThereUnscheduledPostsToLoad,
			getLastLoadedPageInUnscheduled,
			isLoadingUnscheduledPosts,
		} = select( NC_CALENDAR );

		return {
			isLoading: isLoadingUnscheduledPosts( query ),
			isFirstPageLoaded: 0 < getLastLoadedPageInUnscheduled( query ),
			areTherePostsToLoad: areThereUnscheduledPostsToLoad( query ),
		};
	} );
};

const usePostLoader = () => {
	const query = useUnscheduledQuery();
	const { loadUnscheduledPosts } = useDispatch( NC_CALENDAR );
	return () => loadUnscheduledPosts( query );
};

const usePostUnscheduler = () => {
	const { unschedulePost, dragEnd } = useDispatch( NC_CALENDAR );
	return ( { type, id }: DraggableItemSummary ) => {
		if ( 'post' === type ) {
			void unschedulePost( id );
		} //end if
		void dragEnd();
	};
};
