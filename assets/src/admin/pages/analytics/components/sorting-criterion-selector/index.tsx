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
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_ANALYTICS } from '~/nelio-content-pages/analytics/store';
import type { SortCriterion } from '~/nelio-content-pages/analytics/store/types';

export const SortingCriterionSelector = (): JSX.Element | null => {
	const isVisible = useSelect( ( select ) =>
		select( NC_DATA ).isGAConnected()
	);
	const criterion = useSelect(
		( select ) => select( NC_ANALYTICS ).getFilterCriteria().sortBy
	);

	const { sortBy: doSortBy, loadPosts } = useDispatch( NC_ANALYTICS );
	const sortBy = ( c: SortCriterion ) => {
		void doSortBy( c );
		void loadPosts();
	};

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-analytics-sorting-criterion">
			{ 'pageviews' === criterion ? (
				<>
					{ _x( 'Sorted by pageviews.', 'text', 'nelio-content' ) }{ ' ' }
					<Button
						className="nelio-content-analytics-sorting-criterion__button"
						variant="link"
						onClick={ () => sortBy( 'engagement' ) }
					>
						{ _x(
							'Sort by engagement',
							'command',
							'nelio-content'
						) }
					</Button>
				</>
			) : (
				<>
					{ _x( 'Sorted by engagement.', 'text', 'nelio-content' ) }{ ' ' }
					<Button
						className="nelio-content-analytics-sorting-criterion__button"
						variant="link"
						onClick={ () => sortBy( 'pageviews' ) }
					>
						{ _x(
							'Sort by pageviews',
							'command',
							'nelio-content'
						) }
					</Button>
				</>
			) }
		</div>
	);
};
