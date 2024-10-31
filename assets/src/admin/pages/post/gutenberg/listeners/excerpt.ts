/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToExcerpt( { setExcerpt }: Actions ): void {
	const { getEditedPostAttribute } = select( EDITOR );
	const update = debounce( setExcerpt, 500 );

	let prevExcerpt: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		// @ts-expect-error This function should return a string.
		const excerpt = getEditedPostAttribute( 'excerpt' ) as string;
		if ( prevExcerpt === excerpt ) {
			return;
		} //end if
		prevExcerpt = excerpt;

		void update( excerpt );
	}, EDITOR );
} //end listenToExcerpt()
