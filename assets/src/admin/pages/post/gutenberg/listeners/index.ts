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
import { listenToContentEditor } from './editor';
import { listenToDate } from './date';
import { listenToExcerpt } from './excerpt';
import { listenToFeaturedImage } from './image';
import { listenToPermalink } from './permalink';
import { listenToPostId } from './id';
import { listenToPostSaved } from './post';
import { listenToStatus } from './status';
import { listenToTaxonomies } from './taxonomies';
import { listenToTitle } from './title';
import { listenToPostSave } from './post-save';

export function addListeners(): void {
	const theStore = dispatch( NC_EDIT_POST );

	listenToPostSave();

	listenToPostId( theStore );
	listenToStatus( theStore );

	listenToFeaturedImage( theStore );
	listenToTitle( theStore );
	listenToDate( theStore );

	listenToContentEditor( theStore );

	listenToExcerpt( theStore );
	listenToPermalink( theStore );
	listenToAuthor( theStore );

	listenToTaxonomies( theStore );

	listenToPostSaved( theStore );
} //end addListeners()
