/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * Extenral dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import type { Actions } from './types';
import { loadPostFromWordPress } from '../../common';

export function listenToPostSaved( { setPost }: Actions ): void {
	const { getPost } = select( NC_EDIT_POST );
	const { isSavingPost, isAutosavingPost, isPreviewingPost } =
		select( EDITOR );

	let wasSavingPost = isSavingPost();
	let wasAutosavingPost = isAutosavingPost();
	let wasPreviewingPost = isPreviewingPost();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const isCurrentlySavingPost = isSavingPost();
		const isCurrentlyAutosavingPost = isAutosavingPost();
		const isCurrentlyPreviewingPost = isPreviewingPost();

		const isDoneSaving =
			( wasSavingPost &&
				! isCurrentlySavingPost &&
				! wasAutosavingPost ) ||
			( wasAutosavingPost &&
				wasPreviewingPost &&
				! isCurrentlyPreviewingPost );

		wasSavingPost = isCurrentlySavingPost;
		wasAutosavingPost = isCurrentlyAutosavingPost;
		wasPreviewingPost = isCurrentlyPreviewingPost;

		if ( isDoneSaving ) {
			const post = getPost();
			void loadPostFromWordPress( post.id ).then( ( savedPost ) =>
				setPost( {
					...post,
					customFields: savedPost.customFields,
					customPlaceholders: savedPost.customPlaceholders,
				} )
			);
		} //end if
	} );
} //end listenToPostSaved()
