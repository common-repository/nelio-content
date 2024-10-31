/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { useSelect } from '@safe-wordpress/data';
import type { GetRecordsHttpQuery, Taxonomy } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { difference, every, filter, find, isObject } from 'lodash';

// =====
// TYPES
// =====

export type User = {
	readonly id: number;
	readonly name: string;
	readonly username: string;
	readonly slug: string;
};

export type Post = {
	readonly id: number;
	readonly slug: string;
	readonly title: {
		readonly raw: string;
	};
	readonly type: string;
};

export type Term = {
	readonly id: number;
	readonly name: string;
	readonly slug: string;
};

export type SearchResults< T > =
	| { readonly finished: false }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< T >;
			readonly more: boolean;
	  };

export type Records< T > =
	| {
			readonly finished: false;
			readonly items: ReadonlyArray< T >;
			readonly pendingItems: ReadonlyArray< number >;
	  }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< T >;
			readonly missingItems: ReadonlyArray< number >;
	  };

// =======
// EXPORTS
// =======

export const useIsKindReady = (
	kind: 'postType' | 'taxonomy' | 'root',
	name: string
): boolean =>
	useSelect( ( select ): boolean => {
		select( CORE );
		switch ( kind ) {
			case 'root':
				return true;

			case 'postType': {
				const types = select( CORE ).getEntityRecords(
					'root',
					'postType',
					{ per_page: -1 }
				);
				return !! find( types, { slug: name } );
			} //end case

			case 'taxonomy': {
				const allTaxonomies: Taxonomy[] =
					select( CORE ).getEntityRecords( 'root', 'taxonomy', {
						per_page: -1,
					} ) || [];
				const taxonomies = allTaxonomies.filter(
					( tax: Taxonomy ) => tax.visibility.public
				);
				return !! find( taxonomies, { slug: name } );
			} //end case
		} //end switch
	} );

export function useEntityRecordSearch(
	kind: 'postType' | 'taxonomy' | 'root',
	name: string,
	query: GetRecordsHttpQuery
): SearchResults< Post > | SearchResults< Term > | SearchResults< User > {
	query = {
		per_page: 10,
		context: name === 'user' ? 'view' : 'edit',
		...query,
	};

	const records = useSelect( ( select ) =>
		select( CORE ).getEntityRecords( kind, name, query )
	);

	const hasFinished = useSelect( ( select ) => {
		const { hasFinishedResolution, hasResolutionFailed } = select( CORE );
		const isDone = ( x: string, y: unknown[] ) =>
			hasFinishedResolution( x, y ) || hasResolutionFailed( x, y );
		return isDone( 'getEntityRecords', [ kind, name, query ] );
	} );

	if ( kind === 'root' && name !== 'user' ) {
		return { finished: true, items: [], more: false };
	} //end if

	if ( ! hasFinished ) {
		return { finished: false };
	} //end if

	switch ( kind ) {
		case 'root':
			const users = filter( records, isUser );
			return {
				finished: true,
				items: users,
				more: query.per_page === users.length,
			};

		case 'postType':
			const posts = filter( records, isPost );
			return {
				finished: true,
				items: posts,
				more: query.per_page === posts.length,
			};

		case 'taxonomy':
			const terms = filter( records, isTerm );
			return {
				finished: true,
				items: terms,
				more: query.per_page === terms.length,
			};
	} //end switch
} //end useEntityRecordSearch()

export function useEntityRecords(
	kind: 'postType' | 'taxonomy' | 'root',
	name: string,
	itemIds: ReadonlyArray< number >
): Records< Post > | Records< Term > | Records< User > {
	const options = { context: name === 'user' ? 'view' : 'edit' } as const;

	const records = useSelect( ( select ) => {
		const { getEntityRecord } = select( CORE );
		return itemIds.map( ( itemId ) =>
			getEntityRecord( kind, name, itemId, options )
		);
	} );

	const finishedStatuses = useSelect( ( select ) => {
		const { hasFinishedResolution, hasResolutionFailed } = select( CORE );
		const isDone = ( x: string, y: unknown[] ) =>
			hasFinishedResolution( x, y ) || hasResolutionFailed( x, y );
		return itemIds.map( ( itemId ) =>
			isDone( 'getEntityRecord', [ kind, name, itemId, options ] )
		);
	} );

	if ( kind === 'root' && name !== 'user' ) {
		return { finished: true, items: [], missingItems: itemIds };
	} //end if

	const hasFinished = every( finishedStatuses );

	switch ( kind ) {
		case 'root': {
			const users = filter( records, isUser );
			const loadedIds = users.map( ( { id } ) => id );
			const pendingIds = difference( itemIds, loadedIds );

			return ! hasFinished
				? { finished: false, items: users, pendingItems: pendingIds }
				: { finished: true, items: users, missingItems: pendingIds };
		}

		case 'postType': {
			const posts = filter( records, isPost );
			const loadedIds = posts.map( ( { id } ) => id );
			const pendingIds = difference( itemIds, loadedIds );
			return ! hasFinished
				? { finished: false, items: posts, pendingItems: pendingIds }
				: { finished: true, items: posts, missingItems: pendingIds };
		}

		case 'taxonomy': {
			const terms = filter( records, isTerm );
			const loadedIds = terms.map( ( { id } ) => id );
			const pendingIds = difference( itemIds, loadedIds );
			return ! hasFinished
				? { finished: false, items: terms, pendingItems: pendingIds }
				: { finished: true, items: terms, missingItems: pendingIds };
		}
	} //end switch
} // end useEntityRecords()

// =======
// HELPERS
// =======

const isUser = ( u: unknown ): u is User =>
	isObject( u ) &&
	!! u &&
	'id' in u &&
	'slug' in u &&
	!! u.id &&
	!! ( u as User ).name;

const isPost = ( p: unknown ): p is Post =>
	isObject( p ) &&
	!! p &&
	'id' in p &&
	'slug' in p &&
	!! p.id &&
	!! p.slug &&
	!! ( p as Post ).type &&
	!! ( p as Post ).title?.raw;

const isTerm = ( t: unknown ): t is Term =>
	isObject( t ) &&
	'id' in t &&
	'slug' in t &&
	!! t &&
	!! t.id &&
	!! t.slug &&
	!! ( t as Term ).name;
