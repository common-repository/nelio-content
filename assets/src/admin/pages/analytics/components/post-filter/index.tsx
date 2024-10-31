/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { AuthorSearcher } from '@nelio-content/components';
import { store as NC_DATA, usePostTypes } from '@nelio-content/data';

import type { AuthorId, Maybe, PostTypeName } from '@nelio-content/types';
import type {
	PeriodMode,
	PeriodValue,
} from '~/nelio-content-pages/analytics/store/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_ANALYTICS } from '~/nelio-content-pages/analytics/store';

import { DateSelector } from './date-selector';
import { TypeSelector } from './type-selector';

export const PostFilter = (): JSX.Element => {
	const criteria = useSelect( ( select ) =>
		select( NC_ANALYTICS ).getFilterCriteria()
	);

	const isMultiAuthor = useSelect( ( select ) =>
		select( NC_DATA ).isMultiAuthor()
	);
	const isMultiType = 1 < usePostTypes( 'analytics' ).length;

	const { author, postType, periodMode, periodValue } = criteria;

	const onChangeAuthor = useAuthorChanger();
	const onChangeDate = useDateChanger();
	const onChangePostType = usePostTypeChanger();

	return (
		<div className="nelio-content-analytics-post-filter">
			<div className="nelio-content-analytics-post-filter__criterion">
				<DateSelector
					mode={ periodMode }
					from={ periodValue.from }
					to={ periodValue.to }
					onChange={ onChangeDate }
				/>
			</div>

			{ isMultiAuthor && (
				<div className="nelio-content-analytics-post-filter__criterion">
					<AuthorSearcher
						value={ author }
						onChange={ onChangeAuthor }
						hasAllAuthors={ true }
					/>
				</div>
			) }

			{ isMultiType && (
				<div className="nelio-content-analytics-post-filter__criterion">
					<TypeSelector
						value={ postType }
						onChange={ onChangePostType }
					/>
				</div>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useAuthorChanger = () => {
	const { loadPosts, setAuthorFilter } = useDispatch( NC_ANALYTICS );

	return ( authorId: Maybe< AuthorId > ) => {
		void setAuthorFilter( authorId );
		void loadPosts();
	};
};

const useDateChanger = () => {
	const [ { fn: debouncedLoader }, setDebouncedLoader ] = useState( {
		fn: noop,
	} );
	const { loadPosts, setPeriodFilter } = useDispatch( NC_ANALYTICS );

	useEffect( () => {
		if ( noop === debouncedLoader ) {
			setDebouncedLoader( {
				fn: debounce( () => void loadPosts(), 600 ),
			} );
		} //end if
	}, [ debouncedLoader ] );

	return ( {
		mode,
		value,
	}: {
		readonly mode: PeriodMode;
		readonly value: PeriodValue;
	} ) => {
		void setPeriodFilter( mode, value );
		if ( 'custom' === mode && ! isValidRange( value ) ) {
			return;
		} //end if
		return 'custom' === mode ? debouncedLoader() : loadPosts();
	};
};

const usePostTypeChanger = () => {
	const { loadPosts, setPostTypeFilter } = useDispatch( NC_ANALYTICS );

	return ( postType: Maybe< PostTypeName > ) => {
		void setPostTypeFilter( postType );
		void loadPosts();
	};
};

// =======
// HELPERS
// =======

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidRange = ( { from = '', to = '' } ) =>
	DATE_REGEX.test( from ) && DATE_REGEX.test( to );

const noop = debounce( (): Promise< void > => new Promise( ( r ) => r() ), 0 );
