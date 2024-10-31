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

export function listenToTitle( { setTitle }: Actions ): void {
	const { getEditedPostAttribute } = select( EDITOR );
	const update = debounce( setTitle, 500 );

	let prevTitle: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		// @ts-expect-error This function should return a string.
		const title = getEditedPostAttribute( 'title' ) as string;
		if ( prevTitle === title ) {
			return;
		} //end if
		prevTitle = title;

		void update( title );
	}, EDITOR );
} //end listenToTitle()
