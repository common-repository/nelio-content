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
import { castArray } from 'lodash';
import { store as NC_DATA, usePost } from '@nelio-content/data';
import type {
	Maybe,
	PaginatedResults,
	Post,
	PostId,
	PostStatusSlug,
	PostTypeName,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { PostOption } from './post-option';
import { AsyncSelectControl } from '../async-select-control';

export type PostSearcherProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onChange: ( val: Maybe< PostId > ) => void;
	readonly placeholder?: string;
	readonly value: Maybe< PostId >;
} & OptionLoaderProps;

type OptionLoaderProps = {
	readonly postStatuses?: PostStatusSlug | ReadonlyArray< PostStatusSlug >;
	readonly postTypes: PostTypeName | ReadonlyArray< PostTypeName >;
	readonly perPage?: number;
	readonly filter?: ( p: Post ) => boolean;
};

export const PostSearcher = ( {
	className,
	disabled,
	onChange,
	placeholder: defaultPlaceholder,
	value,
	...loaderProps
}: PostSearcherProps ): JSX.Element => {
	const post = usePost( value );
	const isLoading = useIsLoadingPost( value );
	const placeholder = usePlaceholder( value, defaultPlaceholder );
	const loadOptions = useOptionLoader( loaderProps );

	const label = post?.title ?? '';
	const selectedOption = ! isLoading && value ? { value, label } : undefined;

	return (
		<AsyncSelectControl
			className={ classnames( [
				className,
				{
					'nelio-content-post-searcher': true,
					'nelio-content-post-searcher--is-loading': isLoading,
				},
			] ) }
			components={ {
				Option: PostOption,
			} }
			disabled={ disabled || isLoading }
			loadOptions={ loadOptions }
			value={ selectedOption }
			onChange={ ( option ) => onChange( option?.value ) }
			additional={ { page: 1 } }
			placeholder={ placeholder }
		/>
	);
};

// =====
// HOOKS
// =====

const useIsLoadingPost = ( value?: PostId ) => ! usePost( value ) && !! value;

const usePlaceholder = ( id?: PostId, defaultPlaceholder?: string ) => {
	const isLoading = useIsLoadingPost( id );
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-content' );
	} //end if

	return (
		defaultPlaceholder || _x( 'Select a post…', 'user', 'nelio-content' )
	);
};

const useOptionLoader = ( {
	postStatuses,
	postTypes,
	perPage = 50,
	filter = () => true,
}: OptionLoaderProps ) => {
	const { receivePosts } = useDispatch( NC_DATA );

	const cacheEntities = ( entities: ReadonlyArray< Post > ) =>
		entities.length && receivePosts( entities );

	return ( query: string, _: unknown, additional?: { page: number } ) =>
		apiFetch< PaginatedResults< ReadonlyArray< Post > > >( {
			path: addQueryArgs( '/nelio-content/v1/post/search', {
				query,
				page: additional?.page ?? 1,
				per_page: perPage,
				type: castArray( postTypes ).join( ',' ),
				status: castArray( postStatuses ).join( ',' ),
			} ),
		} ).then( ( data ) => {
			void cacheEntities( data.results );
			const results = data.results.filter( filter );
			const x = {
				options: results.map( ( option ) => ( {
					value: option.id,
					label: option.title,
				} ) ),
				hasMore: data.pagination.more,
				additional: {
					page: ( additional?.page ?? 1 ) + 1,
				},
			};
			return x;
		} );
};
