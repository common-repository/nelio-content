/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { listenToContentEditor } from './editor';
import { listenToExcerpt } from './excerpt';
import { listenToFeaturedImage } from './image';
import { listenToPostSaved } from './post';
import { listenToStatus } from './status';
import { listenToTitle } from './title';

export function addListeners(): void {
	const theStore = dispatch( NC_EDIT_POST );

	listenToStatus( theStore );

	listenToFeaturedImage( theStore );
	listenToTitle( theStore );

	listenToContentEditor( theStore );

	listenToExcerpt( theStore );

	listenToPostSaved( theStore );
} //end addListeners()
