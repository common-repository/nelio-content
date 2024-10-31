/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { store as CORE } from '@safe-wordpress/core-data';
import {
	useSelect,
	useDispatch,
	select as doSelect,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { map, zipObject } from 'lodash';
import { ItemSelectControl } from '@nelio-content/components';
import type {
	Maybe,
	Taxonomy,
	TaxonomySlug,
	Term,
	TermId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../store';
import { useSupportedTaxonomies } from '../../hooks';

export type TaxonomiesProps = {
	readonly showLabels?: boolean;
};

export const Taxonomies = ( { showLabels }: TaxonomiesProps ): JSX.Element => {
	const taxonomies = useSupportedTaxonomies();
	const [ termsPerTaxonomy, setTaxonomyTerms ] = useTaxonomies();
	return (
		<>
			{ taxonomies.map( ( { slug, labels } ) => (
				<ItemSelectControl
					key={ slug }
					label={ showLabels ? labels.name : undefined }
					placeholder={ labels.search_items }
					kind="taxonomy"
					name={ slug }
					value={ map(
						termsPerTaxonomy[ slug as TaxonomySlug ],
						'id'
					) }
					onChange={ setTaxonomyTerms( slug as TaxonomySlug ) }
				/>
			) ) }
		</>
	);
};

// =====
// HOOKS
// =====

const useTaxonomies = (): [
	Record< TaxonomySlug, ReadonlyArray< Term > >,
	( taxonomy: TaxonomySlug ) => ( terms: ReadonlyArray< TermId > ) => void,
] => {
	const taxonomies = useSupportedTaxonomies().map(
		( t ) => t.slug as TaxonomySlug
	);
	const termsPerTaxonomy = useSelect( ( select ) => {
		const { getPostTerms } = select( NC_POST_EDITOR );
		return zipObject( taxonomies, taxonomies.map( getPostTerms ) );
	} );

	const { setPostTerms } = useDispatch( NC_POST_EDITOR );

	// Improve this
	const { getEntityRecord: g } = doSelect( CORE );
	const termify =
		( t: TaxonomySlug ) =>
		( id: TermId ): Term => ( {
			id,
			name:
				( g( 'taxonomy', t, id ) as Maybe< Taxonomy > )?.name ||
				`Term ${ id }`,
			slug:
				( g( 'taxonomy', t, id ) as Maybe< Taxonomy > )?.slug ||
				`term-${ id }`,
		} );

	const setTaxonomyTerms =
		( taxonomy: TaxonomySlug ) => ( terms: ReadonlyArray< TermId > ) =>
			setPostTerms( taxonomy, map( terms, termify( taxonomy ) ) );

	return [ termsPerTaxonomy, setTaxonomyTerms ];
};
