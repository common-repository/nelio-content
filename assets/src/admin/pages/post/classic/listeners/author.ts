/**
 * External dependencies
 */
import { seemsAuthorId } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToAuthor( { setAuthor }: Actions ): void {
	const authorField = document.getElementById(
		'post_author_override'
	) as HTMLSelectElement;
	if ( ! authorField ) {
		return;
	} //end if

	authorField.addEventListener( 'change', () => {
		const authorId = Number.parseInt( authorField.value );
		if ( ! seemsAuthorId( authorId ) ) {
			return;
		} //end if

		const options = authorField.options || [];
		const name = options[ authorField.selectedIndex ]?.text ?? '';
		void setAuthor( authorId, name );
	} );
} //end listenToAuthor()
