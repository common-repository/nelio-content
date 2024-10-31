/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * Extenral dependencies
 */
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToContentEditor( { setContent }: Actions ): void {
	const { getEditedPostAttribute } = select( EDITOR );
	const update = debounce( setContent, 2500 );

	let prevContent: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		// @ts-expect-error This function should return a string.
		const content = getEditedPostAttribute( 'content' ) as string;
		if ( prevContent === content ) {
			return;
		} //end if
		prevContent = content;

		void update( content );
	}, EDITOR );
} //end listenToContentEditor()
