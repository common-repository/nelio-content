/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map, sortBy } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export const FeedFilter = (): JSX.Element | null => {
	const isLoading = useIsLoading();
	const [ activeFeed, setActiveFeed ] = useActiveFeed();
	const options = useFeeds();

	if ( options.length < 3 ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-feed-filter">
			<SelectControl
				disabled={ isLoading }
				options={ options }
				value={ activeFeed }
				onChange={ setActiveFeed }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveFeed = () => {
	const activeFeed = useSelect( ( select ) =>
		select( NC_FEEDS ).getActiveFeed()
	);
	const { setActiveFeed } = useDispatch( NC_FEEDS );
	return [ activeFeed, setActiveFeed ] as const;
};

const useIsLoading = () => {
	const [ feed ] = useActiveFeed();
	return useSelect( ( select ) =>
		'all-feeds' === feed
			? select( NC_FEEDS ).isLoadingAFeed()
			: select( NC_FEEDS ).isLoadingFeed( feed )
	);
};

const useFeeds = () =>
	useSelect( ( select ) => [
		{
			value: 'all-feeds' as const,
			label: _x( 'Show all feeds', 'command', 'nelio-content' ),
		},
		...sortBy(
			map( select( NC_DATA ).getFeeds(), ( { id, name } ) => ( {
				value: id,
				label: name,
			} ) ),
			'label'
		),
	] );
