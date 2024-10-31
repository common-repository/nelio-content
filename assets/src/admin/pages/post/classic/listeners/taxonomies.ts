/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { select, subscribe } from '@safe-wordpress/data';
import type { Taxonomy } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { debounce, filter, isEqual, startCase, trim } from 'lodash';
import { make } from 'ts-brand';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { Maybe, TaxonomySlug, Term, TermId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToTaxonomies( { setTerms }: Actions ): void {
	const { getPostType } = select( NC_EDIT_POST );
	const { getEntityRecords } = select( CORE );

	let prevHash = '';
	const doUpdateTerms = () => {
		const allTaxonomies: ReadonlyArray< Taxonomy > =
			getEntityRecords( 'root', 'taxonomy', {
				per_page: -1,
			} ) || [];

		const taxonomies = filter(
			allTaxonomies,
			( tax ) =>
				tax.visibility.public &&
				tax.types.includes( getPostType() ?? '' )
		).map( ( tax ) => tax.slug as TaxonomySlug );

		const terms = taxonomies.map( getTerms );

		const hash = JSON.stringify( terms );
		if ( hash === prevHash ) {
			return;
		} //end if
		prevHash = hash;

		taxonomies.forEach( ( tax, i ) => setTerms( tax, terms[ i ] ?? [] ) );
	};

	const updateTerms = debounce( doUpdateTerms, 500 );
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( updateTerms );
	listenToHierarchicalTaxonomies( updateTerms );
	listenToFlatTaxonomies( updateTerms );
} //end listenToTaxonomies()

// =======
// HELPERS
// =======

const getTerms = ( tax: TaxonomySlug ): ReadonlyArray< Term > =>
	getTermsInHierarchicalTaxonomy( tax ) ||
	getTermsInFlatTaxonomy( tax ) ||
	[];

const getTermsInHierarchicalTaxonomy = (
	tax: TaxonomySlug
): Maybe< ReadonlyArray< Term > > => {
	const el = document.getElementById( `${ tax }checklist` );
	if ( ! el ) {
		return undefined;
	} //end if

	const checkboxes = Array.from(
		el.querySelectorAll< HTMLInputElement >(
			'input[type="checkbox"]:checked'
		)
	);

	const ids = checkboxes
		.map( ( checkbox ) => checkbox.id )
		.map( ( id ) => id.replace( `in-${ tax }-`, '' ) )
		.map( ( id ) => parseInt( id ) )
		.filter( Boolean );

	const { getEntityRecord } = select( CORE );
	return ids
		.map( ( id ) => getEntityRecord( 'taxonomy', tax, id ) )
		.filter( isTerm )
		.map( ( { id, name, slug } ) => ( { id, name, slug } ) );
};

const getTermsInFlatTaxonomy = (
	tax: TaxonomySlug
): Maybe< ReadonlyArray< Term > > => {
	const el = document.getElementById( tax );
	if ( ! el ) {
		return undefined;
	} //end if

	return Array.from( el.querySelector( '.tagchecklist' )?.children || [] )
		.map( ( node ) => {
			const children = filter( Array.from( node.childNodes ), {
				nodeType: Node.TEXT_NODE,
			} );
			const text = children.map( ( { textContent } ) => textContent );
			return startCase( trim( text.join( '' ) ) );
		} )
		.map(
			( name, id ): Term => ( {
				id: make< TermId >()( id + 1 ),
				name,
				slug: name.toLowerCase().replace( /\s+/g, '-' ),
			} )
		);
};

const isTerm = ( t: unknown ): t is Term =>
	!! t && typeof t === 'object' && 'id' in t && 'name' in t && 'slug' in t;

const listenToHierarchicalTaxonomies = ( callback: () => void ): void => {
	let prevCheckboxes: ReadonlyArray< HTMLInputElement > = [];
	const doListenToCheckboxes = () => {
		const checkboxes = Array.from(
			document.querySelectorAll< HTMLInputElement >(
				'.categorydiv input[type="checkbox"]'
			)
		);
		if ( isEqual( prevCheckboxes, checkboxes ) ) {
			return;
		} //end if

		prevCheckboxes.forEach( ( cb: HTMLInputElement ) =>
			cb.removeEventListener( 'change', callback )
		);

		prevCheckboxes = checkboxes;
		checkboxes.forEach( ( cb: HTMLInputElement ) =>
			cb.addEventListener( 'change', callback )
		);
		callback();
	};
	doListenToCheckboxes();

	const listenToCheckboxes = debounce( doListenToCheckboxes, 2000 );
	const observer = new MutationObserver( listenToCheckboxes );
	document
		.querySelectorAll( '.categorydiv' )
		.forEach( ( el ) =>
			observer.observe( el, { childList: true, subtree: true } )
		);
};

const listenToFlatTaxonomies = ( callback: () => void ): void => {
	const observer = new MutationObserver( callback );
	document
		.querySelectorAll( '.tagsdiv' )
		.forEach( ( el ) =>
			observer.observe( el, { childList: true, subtree: true } )
		);
};
