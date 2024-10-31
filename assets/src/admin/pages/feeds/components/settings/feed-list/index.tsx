/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';

import { Feed } from './feed';

export const FeedList = (): JSX.Element => {
	const feeds = useSelect( ( select ) => select( NC_DATA ).getFeedIds() );

	if ( isEmpty( feeds ) ) {
		return (
			<div className="nelio-content-empty-feed-list">
				{ _x(
					'Add your first RSS feed using the form above',
					'user',
					'nelio-content'
				) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-feed-list">
			{ feeds.map( ( id ) => (
				<Feed key={ id } feedId={ id } />
			) ) }
		</div>
	);
};
