/**
 * External dependencies
 */
import isFunction from 'lodash/isFunction';
import trim from 'lodash/trim';
import type { Editor, AddOnManager } from 'tinymce';
import type { Url } from '@nelio-content/types';

// =====
// TYPES
// =====

type EditorId = string;

type EditorButtonId = string;

type EditorButton = {
	readonly text: string;
	readonly disabled: ( value: boolean ) => void;
	readonly onclick: () => void;
	readonly onPostRender: () => void;
};

type Win = Window &
	typeof globalThis & {
		readonly NelioContentTinyMCE?: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			readonly isEmpty: ( x: any ) => boolean;
			readonly getLinks: ( html: string ) => ReadonlyArray< Url >;
			readonly createMessage: (
				text: string,
				links: ReadonlyArray< Url >
			) => void;
		};

		readonly NelioContentTinyMCEi18n?: {
			readonly createAction: string;
			readonly description: string;
			readonly highlightAction: string;
			readonly pluginUrl: string;
			readonly removeAction: string;
		};

		readonly tinymce: {
			readonly PluginManager: AddOnManager;
		};
	};

// =======
// GLOBALS
// =======

const w = window as Win;
const SHARE_BUTTONS: Record<
	EditorId,
	Record< EditorButtonId, EditorButton >
> = {};

w.tinymce.PluginManager.add( 'nelio_content', ( editor ) => {
	addShareButtons( editor );
	return {
		getMetadata: () => ( {
			name: 'Nelio Content',
			url:
				w.NelioContentTinyMCEi18n?.pluginUrl ||
				'https://neliosoftware.com/content/',
		} ),
	};
} );

// ==================
// IMPORT WORKAROUNDS
// ==================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEmpty = ( x: any ) =>
	isFunction( w.NelioContentTinyMCE?.isEmpty )
		? !! w.NelioContentTinyMCE?.isEmpty( x )
		: true;

const getLinks = ( html: string ) =>
	isFunction( w.NelioContentTinyMCE?.getLinks )
		? w.NelioContentTinyMCE?.getLinks( html ) ?? []
		: [];

const createMessage = ( text: string, links: ReadonlyArray< Url > ) =>
	void (
		isFunction( w.NelioContentTinyMCE?.createMessage ) &&
		w.NelioContentTinyMCE?.createMessage( text, links )
	);

// =======
// HELPERS
// =======

function addShareButtons( editor: Editor ) {
	editor.addButton( 'nelio_content', {
		title:
			w.NelioContentTinyMCEi18n?.description ||
			'Social Automations by Nelio Content',
		type: 'menubutton',
		icon: 'nelio-content-icon',
		disabled: false,
		onclick: () => fixShareButtons( editor ),
		menu: [
			addButtonForCreatingSocialMessage( editor ),
			addButtonForCreatingShareBlock( editor ),
			addButtonForRemovingShareBlocks( editor ),
		],
	} );
} //end addShareButtons()

function addButtonForCreatingSocialMessage( editor: Editor ) {
	return {
		text:
			w.NelioContentTinyMCEi18n?.createAction || 'Create Social Message',
		disabled: true,
		onclick: () => {
			const html = editor.selection.getContent( { format: 'html' } );
			const text = editor.selection.getContent( { format: 'text' } );
			const links = getLinks( html ) ?? [];
			createMessage( text, links );
		},
		onPostRender() {
			initButton(
				editor,
				'createSocialMessage',
				this as unknown as EditorButton
			);
		},
	};
} //end addButtonForCreatingSocialMessage()

function addButtonForCreatingShareBlock( editor: Editor ) {
	return {
		text:
			w.NelioContentTinyMCEi18n?.highlightAction ||
			'Highlight for Auto Sharing',
		disabled: false,
		onclick: () => editor.formatter.apply( 'ncshare' ),
		onPostRender() {
			initButton(
				editor,
				'addShareBlock',
				this as unknown as EditorButton
			);
		},
	};
} //end addButtonForCreatingShareBlock()

function addButtonForRemovingShareBlocks( editor: Editor ) {
	return {
		text: w.NelioContentTinyMCEi18n?.removeAction || 'Remove Highlight',
		disabled: false,
		onclick: () => editor.formatter.remove( 'ncshare' ),
		onPostRender() {
			initButton(
				editor,
				'removeShareBlock',
				this as unknown as EditorButton
			);
		},
	};
} //end addButtonForRemovingShareBlocks()

function initButton( editor: Editor, name: string, button: EditorButton ) {
	SHARE_BUTTONS[ editor.id ] = {
		...( SHARE_BUTTONS[ editor.id ] || {} ),
		[ name ]: button,
	};
	fixShareButtons( editor );
} //end initButton()

function fixShareButtons( editor: Editor ) {
	editor.formatter.register( 'ncshare', {
		inline: 'ncshare',
		remove: 'all',
	} );
	const text = editor.selection.getContent( { format: 'text' } );
	const isTextSelected = ! isEmpty( trim( text ) );
	const buttons = SHARE_BUTTONS[ editor.id ];

	if ( ! buttons ) {
		return;
	} //end if

	if ( buttons.createSocialMessage ) {
		buttons.createSocialMessage.disabled( ! isTextSelected );
	} //end if

	if ( buttons.addShareBlock ) {
		buttons.addShareBlock.disabled( ! isTextSelected );
	} //end if

	if ( buttons.removeShareBlock ) {
		buttons.removeShareBlock.disabled( ! areShareBlocksSelected( editor ) );
	} //end if
} //end fixShareButtons()

function areShareBlocksSelected( editor: Editor ) {
	return (
		editor.formatter.match( 'ncshare' ) ||
		editor.selection.getContent().toLowerCase().includes( '<ncshare' )
	);
} //end areShareBlocksSelected()
