/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export type SearcherProps = {
	readonly className?: string;
};

export const Searcher = ( { className = '' }: SearcherProps ): JSX.Element => {
	const [ query, setQuery ] = useUnscheduledQuery();
	return (
		<div
			className={ classnames( {
				[ className ]: true,
				'nelio-content-unscheduled-post-searcher': true,
			} ) }
		>
			<TextControl
				value={ query }
				placeholder={ _x( 'Search', 'text', 'nelio-content' ) }
				onChange={ setQuery }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useUnscheduledQuery = () => {
	const query = useSelect(
		( select ) =>
			select( NC_CALENDAR ).getUnscheduledPostsSearchQuery() || ''
	);
	const [ lastQuery, setLastQuery ] = useState( query );
	const [ timeout, setTimeout ] = useUnscheduledTimeout();
	const { loadUnscheduledPosts } = useDispatch( NC_CALENDAR );

	useEffect( () => {
		if ( query === lastQuery ) {
			return;
		} //end if
		setLastQuery( query );
		clearTimeout( timeout );
		void setTimeout( () => void loadUnscheduledPosts( query ), 250 );
	}, [ query, lastQuery ] );

	const { setUnscheduledPostsQuery } = useDispatch( NC_CALENDAR );
	return [ query, setUnscheduledPostsQuery ] as const;
};

const useUnscheduledTimeout = () => {
	const timeout = useSelect( ( select ) =>
		select( NC_CALENDAR ).getUnscheduledPostsSearchTimeout()
	);

	const { setUnscheduledPostsSearchTimeout } = useDispatch( NC_CALENDAR );
	const doSetTimeout = ( fn: () => void, time: number ) =>
		setUnscheduledPostsSearchTimeout( setTimeout( fn, time ) );

	return [ timeout, doSetTimeout ] as const;
};
