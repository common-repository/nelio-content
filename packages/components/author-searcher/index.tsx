/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';
import { useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { make } from 'ts-brand';
import type { OptionProps } from 'react-select';
import { store as NC_DATA, useAuthor } from '@nelio-content/data';
import type {
	Author,
	AuthorId,
	Maybe,
	PaginatedResults,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { AuthorOption } from './author-option';
import type { AuthorData } from './author-option';
import { AsyncSelectControl } from '../async-select-control';

const ALL_AUTHORS = make< AuthorId >()( 0 );

export type AuthorSearcherProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onChange: ( val: Maybe< AuthorId > ) => void;
	readonly placeholder?: string;
	readonly value?: Maybe< AuthorId >;
} & Partial< OptionLoaderProps >;

type OptionLoaderProps = {
	readonly allAuthorsLabel: string;
	readonly hasAllAuthors: boolean;
	readonly perPage: number;
};

export const AuthorSearcher = ( {
	className,
	disabled,
	hasAllAuthors,
	allAuthorsLabel = _x( 'All Authors', 'text', 'nelio-content' ),
	onChange,
	placeholder: defaultPlaceholder,
	value,
	...loaderProps
}: AuthorSearcherProps ): JSX.Element => {
	const author = useAuthor( value );
	const isLoading = useIsLoadingAuthor( value );
	const placeholder = usePlaceholder( value, defaultPlaceholder );
	const loadOptions = useOptionLoader( {
		perPage: 10,
		...loaderProps,
		hasAllAuthors: !! hasAllAuthors,
		allAuthorsLabel,
	} );

	const label: string = author?.name ?? '';
	let selectedOption: Maybe< AuthorData >;
	if ( isLoading ) {
		selectedOption = undefined;
	} else if ( ! value ) {
		selectedOption = hasAllAuthors
			? { value: ALL_AUTHORS, label: allAuthorsLabel }
			: undefined;
	} else {
		selectedOption = { value, label };
	} //end if

	return (
		<AsyncSelectControl
			className={ classnames( [
				className,
				{
					'nelio-content-author-searcher': true,
					'nelio-content-author-searcher--is-loading': isLoading,
				},
			] ) }
			components={ {
				Option: ( props: OptionProps< AuthorData > ) => (
					<AuthorOption
						allAuthorsLabel={ allAuthorsLabel }
						{ ...props }
					/>
				),
			} }
			disabled={ disabled || isLoading }
			loadOptions={ loadOptions }
			value={ selectedOption }
			onChange={ ( option ) =>
				option?.value ? onChange( option.value ) : onChange( undefined )
			}
			additional={ { page: 1 } }
			placeholder={ placeholder }
		/>
	);
};

// =====
// HOOKS
// =====

const useIsLoadingAuthor = ( id?: AuthorId ) => ! useAuthor( id ) && !! id;

const usePlaceholder = ( id?: AuthorId, defaultPlaceholder?: string ) => {
	const isLoading = useIsLoadingAuthor( id );
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-content' );
	} //end if

	return (
		defaultPlaceholder || _x( 'Select an author…', 'user', 'nelio-content' )
	);
};

const useOptionLoader = ( props: OptionLoaderProps ) => {
	const { hasAllAuthors, allAuthorsLabel, perPage } = props;

	const { receiveAuthors } = useDispatch( NC_DATA );
	const cacheEntities = ( entities: ReadonlyArray< Author > ) =>
		entities.length && receiveAuthors( entities );

	return ( query: string, _: unknown, additional?: { page: number } ) =>
		apiFetch< PaginatedResults< ReadonlyArray< Author > > >( {
			path: addQueryArgs( '/nelio-content/v1/author/search', {
				query,
				page: additional?.page ?? 1,
				per_page: perPage,
			} ),
		} ).then( ( data ) => {
			void cacheEntities( data.results );

			const options = data.results.map( ( option ) => ( {
				value: option.id,
				label: `${ option.name } (${ option.email })`,
			} ) );

			if ( hasAllAuthors && ! query && 1 === ( additional?.page ?? 1 ) ) {
				options.unshift( {
					value: ALL_AUTHORS,
					label: allAuthorsLabel,
				} );
			} //end if

			return {
				options,
				hasMore: data.pagination.more,
				additional: {
					page: ( additional?.page ?? 1 ) + 1,
				},
			};
		} );
};
