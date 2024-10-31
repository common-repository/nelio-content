/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * WordPress dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';

export function listenToPostSave(): void {
	const { isEditedPostDirty } = select( EDITOR );
	const { getPostId } = select( NC_EDIT_POST );
	const { getPost } = select( NC_DATA );
	const { invalidateResolution, removePost } = dispatch( NC_DATA );

	let prevDirty = isEditedPostDirty();
	const postId = getPostId();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const dirty = isEditedPostDirty();
		if ( dirty === prevDirty ) {
			return;
		} //end if
		const wasDirty = prevDirty;
		prevDirty = dirty;

		if ( ! postId ) {
			return;
		} //end if

		if ( wasDirty && ! dirty ) {
			void removePost( postId );
			void invalidateResolution( 'getPost', [ postId ] );
			getPost( postId );
		} //end if
	} );
} //end listenToPostSave()
