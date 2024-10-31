/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingAnimation } from '@nelio-content/components';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { Item } from './item';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export const FeedItemList = (): JSX.Element => {
	const isLoading = useIsLoading();
	const isSingleFeed = useIsSingleFeed();
	const itemIds = useFeedItems();

	if ( isLoading ) {
		return (
			<div className="nelio-content-feed-item-list">
				<LoadingAnimation />
			</div>
		);
	} //end if

	if ( isEmpty( itemIds ) ) {
		return (
			<div className="nelio-content-feed-item-list">
				{ isSingleFeed
					? _x(
							'This feed doesn’t have any publications.',
							'text',
							'nelio-content'
					  )
					: _x(
							'We couldn’t find any publications in your feeds.',
							'text',
							'nelio-content'
					  ) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-feed-item-list">
			{ itemIds.map( ( itemId ) => (
				<Item key={ itemId } itemId={ itemId } />
			) ) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveFeed = () =>
	useSelect( ( select ) => select( NC_FEEDS ).getActiveFeed() );

const useIsSingleFeed = () => 'all-feeds' !== useActiveFeed();

const useIsLoading = () => {
	const feed = useActiveFeed();
	return useSelect( ( select ) =>
		'all-feeds' === feed
			? select( NC_FEEDS ).isLoadingAFeed()
			: select( NC_FEEDS ).isLoadingFeed( feed )
	);
};

const useFeedItems = () => {
	const feed = useActiveFeed();
	return useSelect( ( select ) =>
		'all-feeds' === feed
			? select( NC_FEEDS ).getAllItems()
			: select( NC_FEEDS ).getAllItemsInFeed( feed )
	);
};
