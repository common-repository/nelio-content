/**
 * Extenral dependencies
 */
import { debounce } from 'lodash';
import type { Dict } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementorFrontend, type Actions } from './types';

export function listenToContentEditor( { setContent }: Actions ): void {
	const elementorFrontend = ( window as unknown as Dict ).elementorFrontend;
	if ( ! isElementorFrontend( elementorFrontend ) ) {
		return;
	} //end if

	const editorContent = elementorFrontend.getElements().$document[ 0 ]?.body;
	if ( ! editorContent ) {
		return;
	} //end if

	const update = debounce( setContent, 2500 );
	let prevContent: string;
	const observer = new MutationObserver( () => {
		const content = editorContent.outerHTML ?? '';
		if ( prevContent === content ) {
			return;
		} //end if

		prevContent = content;

		void update( content );
	} );

	const observerInitializer = new MutationObserver( () => {
		const elementorEditArea = editorContent.querySelector(
			'.elementor-edit-area'
		);
		if ( ! elementorEditArea ) {
			return;
		} //end if

		observer.observe( elementorEditArea, {
			subtree: true,
			childList: true,
		} );

		observerInitializer.disconnect();
	} );

	observerInitializer.observe( editorContent, {
		subtree: true,
		childList: true,
	} );
} //end listenToContentEditor()
