/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { Dict } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementor, type Actions } from './types';
import { loadPostFromWordPress } from '../../common';

export function listenToPostSaved( { setPost }: Actions ): void {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	const { getPost } = select( NC_EDIT_POST );

	elementor.channels.editor.on( 'saved', () => {
		const post = getPost();
		void loadPostFromWordPress( post.id ).then( ( savedPost ) => {
			void setPost( {
				...post,
				permalink: savedPost.permalink,
				customFields: savedPost.customFields,
				customPlaceholders: savedPost.customPlaceholders,
			} );
		} );
	} );
} //end listenToPostSaved()
