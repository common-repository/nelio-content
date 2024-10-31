/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToExcerpt( { setExcerpt }: Actions ): void {
	const excerptField = document.getElementById(
		'excerpt'
	) as HTMLTextAreaElement;
	if ( ! excerptField ) {
		return;
	} //end if

	excerptField.addEventListener(
		'change',
		debounce( () => {
			const excerpt = excerptField.value;
			if ( ! excerpt ) {
				return;
			} //end if
			void setExcerpt( excerpt );
		}, 500 )
	);
} //end listenToExcerpt()
