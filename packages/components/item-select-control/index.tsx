/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useInstanceId } from '@safe-wordpress/compose';
import { BaseControl, FormTokenField } from '@safe-wordpress/components';
import { store as CORE } from '@safe-wordpress/core-data';
import { useSelect } from '@safe-wordpress/data';
import { useEffect, useRef, useState } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';
import type { GetRecordsHttpQuery } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { castArray, isString, debounce } from 'lodash';
import type { Dict, Maybe, PostId, TermId, UserId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useIsKindReady as useIsProperKindReady,
	useEntityRecords as useProperEntityRecords,
	useEntityRecordSearch as useProperEntityRecordSearch,
} from './hooks';
import type { Post, Term, User } from './hooks';

type Item = {
	readonly id: number;
	readonly name: string;
};

type FormValue = {
	readonly itemId: number;
	readonly value: string;
	readonly title: string;
};

export type ItemSelectControlProps =
	| ValueProps< 'postType', string, PostId >
	| ValueProps< 'taxonomy', string, TermId >
	| ValueProps< 'author', '', UserId >;

type ValueProps< TKind, TName, TValue > =
	| ( {
			readonly kind: TKind;
			readonly isSingle: true;
			readonly value: Maybe< TValue >;
			readonly onChange: ( value: Maybe< TValue > ) => void;
	  } & ExtraProps &
			( TName extends ''
				? { readonly name?: never }
				: { readonly name: TName } ) )
	| ( {
			readonly kind: TKind;
			readonly isSingle?: false;
			readonly value: ReadonlyArray< TValue >;
			readonly onChange: ( value: ReadonlyArray< TValue > ) => void;
	  } & ExtraProps &
			( TName extends ''
				? { readonly name?: never }
				: { readonly name: TName } ) );

type ExtraProps = {
	readonly id?: string;
	readonly help?: string | false;
	readonly error?: string | false;
	readonly disabled?: boolean;
	readonly label?: string;
	readonly placeholder?: string;
};

export const ItemSelectControl = ( {
	id,
	help,
	error,
	kind,
	name = '',
	value: originalValue,
	disabled,
	label,
	placeholder,
	isSingle,
	onChange,
}: ItemSelectControlProps ): JSX.Element | null => {
	const instanceId = useInstanceId( ItemSelectControl );
	const value: ReadonlyArray< number > = originalValue
		? castArray( originalValue )
		: [];
	const [ autoExpand, setAutoExpand ] = useState( false ); // NOTE. Workaround.
	const isKindReady = useIsKindReady( kind, name );
	const hasSingleValue = isSingle && !! value.length;

	const {
		setQuery,
		items: foundItems,
		loadMoreItems,
	} = useSearchResult( kind, name, { exclude: value } );
	const ref = useRef( null );
	useEffectOnScrollEnd( ref.current, loadMoreItems );
	useEffectOnFocusAndBlur( ref.current, setAutoExpand );

	const onSelectionChange = ( selection: ReadonlyArray< unknown > ) => {
		const str = selection.find( isString ) ?? '';
		const item = findByName( str, foundItems );
		const newValue = [ ...selection, { itemId: item?.id } ]
			.filter( isFormValue )
			.map( ( s ) => s.itemId );

		if ( isSingle ) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
			onChange( newValue[ 0 ] as any );
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
			onChange( newValue as any );
		} //end if
	};

	const currentRecords = useEntityRecords( kind, name, value );
	const selectedItems = [
		...currentRecords.items.map( simplify ),
		...( currentRecords.finished
			? currentRecords.missingItems.map( makeMissingItem( kind ) )
			: currentRecords.pendingItems.map( makeLoadingItem ) ),
	];

	const hasResults = useHasResults( kind, name );
	if ( ! hasResults && ! selectedItems.length ) {
		return null;
	} //end if

	placeholder = placeholder ?? _x( 'Search…', 'user', 'nelio-content' );

	return (
		<BaseControl
			id={ id ?? `nelio-content-item-select-control-${ instanceId }` }
			help={
				error ? (
					<span className="nelio-content-error-help">{ error }</span>
				) : (
					help
				)
			}
		>
			<div
				ref={ ref }
				className={ classnames( 'nelio-content-item-select-control', {
					'nelio-content-item-select-control--no-input':
						hasSingleValue,
					'nelio-content-item-select-control--no-label': ! label,
				} ) }
			>
				<FormTokenField
					value={ selectedItems.map( itemToFormValue ) }
					disabled={ disabled || ! isKindReady }
					suggestions={ foundItems.map( ( p ) => p.name ) }
					onInputChange={ setQuery }
					onChange={ onSelectionChange }
					maxLength={ isSingle ? 1 : undefined }
					{ ...{
						label,
						__experimentalExpandOnFocus:
							autoExpand && ! hasSingleValue,
						placeholder: isKindReady
							? placeholder
							: _x( 'Loading…', 'text', 'nelio-popups' ),
					} }
				/>
			</div>
		</BaseControl>
	);
};

// =====
// HOOKS
// =====

const useIsKindReady = (
	kind: 'postType' | 'taxonomy' | 'author',
	name: string
) =>
	useIsProperKindReady(
		'author' === kind ? 'root' : kind,
		'author' === kind ? 'user' : name
	);

const useEntityRecords = (
	kind: 'postType' | 'taxonomy' | 'author',
	name: string,
	value: ReadonlyArray< number >
) =>
	useProperEntityRecords(
		'author' === kind ? 'root' : kind,
		'author' === kind ? 'user' : name,
		value
	);

const useEntityRecordSearch = (
	kind: 'postType' | 'taxonomy' | 'author',
	name: string,
	searchQuery: GetRecordsHttpQuery
) =>
	useProperEntityRecordSearch(
		'author' === kind ? 'root' : kind,
		'author' === kind ? 'user' : name,
		'author' === kind ? { ...searchQuery, who: 'authors' } : searchQuery
	);

const useSearchResult = (
	kind: 'postType' | 'taxonomy' | 'author',
	name: string,
	searchQuery: GetRecordsHttpQuery
) => {
	const [ items, setItems ] = useState< ReadonlyArray< Item > >( [] );
	const [ query, doSetQuery ] = useState( '' );
	const [ page, setPage ] = useState( 1 );
	const searchResult = useEntityRecordSearch( kind, name, {
		...searchQuery,
		search: query,
		page,
	} );

	useEffect( () => {
		if ( ! searchResult.finished ) {
			return;
		} //end if

		const cleanItems = searchResult.items.map( simplify );
		setItems( 1 === page ? cleanItems : [ ...items, ...cleanItems ] );
	}, [
		searchQuery.exclude?.join( ',' ) ?? '',
		searchResult.finished,
		query,
		page,
	] );

	return {
		items: filterByQuery( { ...searchQuery, search: query }, items ),
		loadMoreItems:
			searchResult.finished && searchResult.more
				? () => setPage( page + 1 )
				: () => void null,
		setQuery: debounce( doSetQuery, 1000 ),
	};
};

const useHasResults = (
	kind: 'postType' | 'taxonomy' | 'author',
	name: string
) =>
	useSelect( ( select ) => {
		const actualKind = 'author' === kind ? 'root' : kind;
		const actualName = 'author' === kind ? 'user' : name;
		const query =
			'author' === kind
				? {
						per_page: 10,
						context: 'view',
						search: '',
						page: 1,
						exclude: [],
						who: 'authors',
				  }
				: {
						per_page: 10,
						context: 'edit',
						search: '',
						page: 1,
						exclude: [],
				  };
		const { hasFinishedResolution, hasResolutionFailed, getEntityRecords } =
			select( CORE );
		const isDone = ( x: string, y: unknown[] ) =>
			hasFinishedResolution( x, y ) || hasResolutionFailed( x, y );

		const records = getEntityRecords( actualKind, actualName, query );
		return (
			isDone( 'getEntityRecords', [ actualKind, actualName, query ] ) &&
			!! records?.length
		);
	} );

const useEffectOnScrollEnd = ( el: HTMLElement | null, callback: () => void ) =>
	useEffect( () => {
		if ( ! el ) {
			return;
		} //end if
		const onScroll = debounce(
			( ev: Event ) =>
				ev.target &&
				isBottomScroll( ev.target as HTMLElement ) &&
				callback(),
			200
		);
		const opts = { capture: true };
		el.addEventListener( 'scroll', onScroll, opts );
		return () => el.removeEventListener( 'scroll', onScroll, opts );
	}, [ callback, el ] );

const useEffectOnFocusAndBlur = (
	el: HTMLElement | null,
	callback: ( expand: boolean ) => void
) =>
	useEffect( () => {
		if ( ! el ) {
			return;
		} //end if
		const onFocus = () => callback( true );
		const onBlur = () => callback( false );
		const opts = { capture: true };
		el.addEventListener( 'focus', onFocus, opts );
		el.addEventListener( 'blur', onBlur, opts );
		return () => {
			el.removeEventListener( 'focus', onFocus, opts );
			el.removeEventListener( 'blur', onBlur, opts );
		};
	}, [ callback, el ] );

// =======
// HELPERS
// =======

const makeMissingItem = (
	kind: 'postType' | 'taxonomy' | 'author'
): ( ( itemId: number ) => Item ) => {
	switch ( kind ) {
		case 'postType':
			return ( itemId: number ): Item => ( {
				id: itemId,
				name: sprintf(
					/* translators: item id */
					_x( 'Missing content %d', 'text', 'nelio-content' ),
					itemId
				),
			} );

		case 'taxonomy':
			return ( itemId: number ): Item => ( {
				id: itemId,
				name: sprintf(
					/* translators: item id */
					_x( 'Missing term %d', 'text', 'nelio-content' ),
					itemId
				),
			} );

		case 'author':
			return ( itemId: number ): Item => ( {
				id: itemId,
				name: sprintf(
					/* translators: item id */
					_x( 'Missing author %d', 'text', 'nelio-content' ),
					itemId
				),
			} );
	} //end switch
};

const makeLoadingItem = ( itemId: number ): Item => ( {
	id: itemId,
	name: sprintf(
		/* translators: an id */
		_x( 'Loading %d…', 'text', 'nelio-content' ),
		itemId
	),
} );

function filterByQuery< T extends Item >(
	searchQuery: GetRecordsHttpQuery,
	items: ReadonlyArray< T >
): ReadonlyArray< T > {
	if ( searchQuery.search ) {
		const { search } = searchQuery;
		items = items.filter( ( item ) =>
			item.name.toLowerCase().includes( search.toLowerCase() )
		);
	} //end if

	if ( searchQuery.exclude ) {
		const { exclude } = searchQuery;
		items = items.filter( ( { id } ) => ! exclude.includes( id ) );
	} //end if

	return items;
}

const findByName = (
	name: string,
	items: ReadonlyArray< Item >
): Maybe< Item > =>
	items.find( ( item ) => item.name.toLowerCase() === name.toLowerCase() );

const itemToFormValue = ( item: Item ): FormValue => ( {
	itemId: item.id,
	value: item.name,
	title: item.name,
} );

const isFormValue = ( p: unknown ): p is FormValue =>
	!! p && !! ( p as Dict ).itemId;

const getName = ( item: Post | Term | User ) => {
	const isPost = ( i: Post | Term | User ): i is Post => ! ( i as Dict ).name;
	return isPost( item ) ? item.title.raw : item.name;
};

const simplify = ( item: Post | Term | User ): Item => ( {
	id: item.id,
	name: sprintf(
		'%1$s (%2$d)',
		getName( item ).replace( /,/g, '' ),
		item.id
	),
} );

const isBottomScroll = ( el: HTMLElement ) =>
	el.scrollHeight - el.scrollTop === el.clientHeight;
