/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';
import type { Taxonomy } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { castArray, filter, debounce } from 'lodash';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { TaxonomySlug, Term } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToTaxonomies( { setTerms }: Actions ): void {
	const { getPostType } = select( NC_EDIT_POST );
	const { getEditedPostAttribute = () => [] } = select( EDITOR );
	const { getEntityRecord, getEntityRecords } = select( CORE );

	let prevHash = '';
	const updateTerms = () => {
		const allTaxonomies: ReadonlyArray< Taxonomy > =
			getEntityRecords( 'root', 'taxonomy', { per_page: -1 } ) || [];
		const taxonomies = filter(
			allTaxonomies,
			( tax ) =>
				tax.visibility.public &&
				tax.types.includes( getPostType() ?? '' )
		).map( ( tax ) => tax.slug as TaxonomySlug );

		const terms = taxonomies.map( ( tax ): ReadonlyArray< Term > => {
			const attr = getAttributeName( tax );
			// @ts-expect-error This “attr” post attribute should be valid, as it’s a taxonomy
			const value = getEditedPostAttribute( attr ) as unknown;
			return castArray( value )
				.filter( isNumber )
				.map( ( id ) => getEntityRecord( 'taxonomy', tax, id ) )
				.filter( isTerm )
				.map( ( { id, name, slug } ) => ( { id, name, slug } ) );
		} );

		const hash = JSON.stringify( terms );
		if ( hash === prevHash ) {
			return;
		} //end if
		prevHash = hash;

		taxonomies.forEach( ( tax, i ) => {
			const term = terms[ i ];
			if ( term ) {
				void setTerms( tax, term );
			} //end if
		} );
	};

	subscribe( debounce( updateTerms, 500 ) );
} //end listenToTaxonomies()

// =======
// HELPERS
// =======

const isNumber = ( i: unknown ): i is number => typeof i === 'number';

const isTerm = ( t: unknown ): t is Term =>
	!! t && typeof t === 'object' && 'id' in t && 'name' in t && 'slug' in t;

function getAttributeName( tax: string ): string {
	switch ( tax ) {
		case 'category':
			return 'categories';
		case 'post_tag':
			return 'tags';
		default:
			return tax;
	} //end switch
} //end getAttributeName()
