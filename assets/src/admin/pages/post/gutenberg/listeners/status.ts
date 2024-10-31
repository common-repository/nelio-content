/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import type { PostStatusSlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToStatus( { setStatus }: Actions ): void {
	const { getEditedPostAttribute } = select( EDITOR );

	let prevStatus: PostStatusSlug;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const status = getEditedPostAttribute( 'status' ) as PostStatusSlug;
		if ( prevStatus === status ) {
			return;
		} //end if
		prevStatus = status;

		void setStatus( status );
	}, EDITOR );
} //end listenToStatus()
