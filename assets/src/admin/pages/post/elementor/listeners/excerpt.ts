/**
 * External dependencies
 */
import { debounce } from 'lodash';
import type { Dict } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementor, type Actions } from './types';

export function listenToExcerpt( { setExcerpt }: Actions ): void {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	const update = debounce( setExcerpt, 500 );

	let prevExcerpt: string;
	elementor.settings.page.model.on(
		'change:post_excerpt',
		function ( model ) {
			const excerpt = model.get( 'post_excerpt' ) as string;
			if ( prevExcerpt === excerpt ) {
				return;
			} //end if
			prevExcerpt = excerpt;

			void update( excerpt );
		}
	);
} //end listenToExcerpt()
