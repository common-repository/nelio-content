/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { filter } from 'lodash';
import { TAG, PROD_TAG, isEmpty } from '@nelio-content/utils';
import type { Taxonomy, TaxonomySlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/tags', {
	icon: 'tag',
	settings: {
		useBadStatus: true,
	},
	attributes: ( select ) => {
		const { getPostType, getTerms } = select( NC_EDIT_POST );
		const { getEntityRecords } = select( CORE );
		const postType = getPostType();
		const allTaxonomies: Taxonomy[] =
			getEntityRecords( 'root', 'taxonomy', { per_page: -1 } ) || [];
		const taxonomies = filter(
			allTaxonomies,
			( tax ) =>
				tax.visibility.public && tax.types.includes( postType ?? '' )
		).map( ( tax ) => tax.slug as TaxonomySlug );

		return {
			tags: getTerms( TAG ) ?? getTerms( PROD_TAG ),
			isActive:
				taxonomies.includes( TAG ) || taxonomies.includes( PROD_TAG ),
		};
	},
	validate: ( { tags }, { useBadStatus } ) => {
		if ( isEmpty( tags ) ) {
			return {
				status: useBadStatus ? 'bad' : 'improvable',
				text: _x( 'Add one or more tags', 'user', 'nelio-content' ),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Content is properly tagged', 'text', 'nelio-content' ),
		};
	},
} );
