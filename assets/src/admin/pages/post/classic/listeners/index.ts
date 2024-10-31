/**
 * WordPress dependencies
 */
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { listenToAuthor } from './author';
import { listenToDate } from './date';
import { listenToContentEditor } from './editor';
import { listenToExcerpt } from './excerpt';
import { listenToFeaturedImage } from './image';
import { listenToPermalink } from './permalink';
import { listenToTaxonomies } from './taxonomies';
import { listenToTitle } from './title';

export function addListeners(): void {
	const theStore = dispatch( NC_EDIT_POST );

	listenToFeaturedImage( theStore );
	listenToTitle( theStore );
	listenToDate( theStore );

	listenToContentEditor( theStore );

	listenToExcerpt( theStore );
	listenToPermalink( theStore );
	listenToAuthor( theStore );

	listenToTaxonomies( theStore );
} //end addListeners()
