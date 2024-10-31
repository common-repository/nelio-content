/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { AuthorId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToAuthor( { setAuthor }: Actions ): void {
	const { getEditedPostAttribute } = select( EDITOR );
	const { getAuthor } = select( NC_DATA );

	let prevAuthorId: Maybe< AuthorId >, prevAuthorName: Maybe< string >;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const authorId = getEditedPostAttribute( 'author' ) as AuthorId;
		const author = getAuthor( authorId );
		const authorName = author?.name ?? '';

		if ( prevAuthorId === authorId && prevAuthorName === authorName ) {
			return;
		} //end if
		prevAuthorId = authorId;
		prevAuthorName = authorName;

		void setAuthor( authorId, authorName );
	} );
} //end listenToAuthor()
