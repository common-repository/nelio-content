/**
 * External dependencies
 */
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToTitle( { setTitle }: Actions ): void {
	const titleField = document.getElementById( 'title' ) as HTMLInputElement;
	if ( ! titleField ) {
		return;
	} //end if

	titleField.addEventListener(
		'change',
		debounce( () => {
			const title = titleField.value || '';
			void setTitle( title );
		}, 500 )
	);
} //end listenToTitle()
