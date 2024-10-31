/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { isUrl } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToPermalink( { setPermalink }: Actions ): void {
	const { getPermalink } = select( EDITOR );
	const update = debounce( setPermalink, 500 );

	let prevPermalink: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const permalink = getPermalink() ?? '';
		if ( prevPermalink === permalink ) {
			return;
		} //end if
		prevPermalink = permalink;

		if ( isUrl( permalink ) ) {
			void update( permalink );
		} //end if
	}, EDITOR );
} //end listenToPermalink()
