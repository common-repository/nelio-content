/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import type { PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToPostId( { setPostId }: Actions ): void {
	const { getEditedPostAttribute, isEditedPostNew } = select( EDITOR );

	let prevPostId: PostId;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		if ( isEditedPostNew() ) {
			return;
		} //end if

		const postId = getEditedPostAttribute( 'id' ) as PostId;
		if ( prevPostId === postId ) {
			return;
		} //end if
		prevPostId = postId;

		void setPostId( postId );
	}, EDITOR );
} //end listenToPostId()
