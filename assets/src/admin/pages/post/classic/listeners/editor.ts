/**
 * External dependencies
 */
import $ from 'jquery';
import { debounce } from 'lodash';
import type { Editor } from 'tinymce';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToContentEditor( { setContent }: Actions ): void {
	$( document ).on( 'tinymce-editor-init', ( _, editor: Editor ) => {
		if ( ! editor || 'content' !== editor.id ) {
			return;
		} //end if
		listenToTinyMce( editor, setContent );
	} );
} //end listenToContentEditor()

function listenToTinyMce(
	editor: Editor,
	setContent: Actions[ 'setContent' ]
) {
	editor.on(
		'nodechange keyup',
		debounce( () => setContent( editor.getContent() ), 2500 )
	);
} //end listenToTinyMce()
