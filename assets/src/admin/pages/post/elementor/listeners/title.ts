/**
 * External dependencies
 */
import { debounce } from 'lodash';
import type { Dict } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementor, type Actions } from './types';

export function listenToTitle( { setTitle }: Actions ): void {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	const update = debounce( setTitle, 500 );

	let prevTitle: string;
	elementor.settings.page.model.on( 'change:post_title', function ( model ) {
		const title = model.get( 'post_title' ) as string;
		if ( prevTitle === title ) {
			return;
		} //end if
		prevTitle = title;

		void update( title );
	} );
} //end listenToTitle()
