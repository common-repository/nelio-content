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
import { listenToCustomFields } from './custom-fields';

export function addListeners(): void {
	const theStore = dispatch( NC_EDIT_POST );
	listenToCustomFields( theStore );
} //end addListeners()
