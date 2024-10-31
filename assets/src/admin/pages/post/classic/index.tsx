/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { dispatch } from '@safe-wordpress/data';
import domReady from '@safe-wordpress/dom-ready';
import { render, StrictMode } from '@safe-wordpress/element';
import { hasQueryArg, removeQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { getPremiumComponent, PremiumDialog } from '@nelio-content/components';
import {
	ReferenceEditor,
	store as NC_EDIT_POST,
} from '@nelio-content/edit-post';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';
import { TaskEditor } from '@nelio-content/task-editor';

/**
 * Internal dependencies
 */
import { init, listenToEditPostStore } from '../common';
import type { Args, QualityAnalysisSettings } from '../common';

import { renderMetaBoxes } from './metaboxes';
import { addListeners } from './listeners';

export async function initPage( args: Args ): Promise< void > {
	args = {
		...args,
		settings: {
			...args.settings,
			isClassicEditor: true,
		},
	};
	addHiddenField( args.settings.nonce );

	await init( args );
	maybeGenerateTimeline();

	renderMetaBoxes();
	maybeHideYoast( args.settings.qualityAnalysis );
	domReady( addEditDialogs );

	addListeners();
} //end initPage()

// =======
// HELPERS
// =======

function addEditDialogs() {
	const wrapper = document.createElement( 'div' );
	wrapper.classList.add( 'nelio-content-editor-dialogs-wrapper' );
	document.body.appendChild( wrapper );

	const FutureActionEditor = getPremiumComponent(
		'post-page/future-action-editor',
		'null'
	);

	render(
		<StrictMode>
			<SlotFillProvider>
				<ReferenceEditor />
				<SocialMessageEditor />
				<TaskEditor />
				<FutureActionEditor />
				<PremiumDialog />
				<Popover.Slot />
			</SlotFillProvider>
		</StrictMode>,
		wrapper
	);
} //end addEditDialogs()

function maybeHideYoast( qualityAnalysis: QualityAnalysisSettings ) {
	if ( ! qualityAnalysis.isFullyIntegrated ) {
		return;
	} //end if

	if ( ! qualityAnalysis.isYoastIntegrated ) {
		return;
	} //end if

	const hide = ( el: HTMLElement | null ) => {
		if ( ! el ) {
			return;
		} //end if
		el.style.display = 'none';
	};

	domReady( () => {
		hide( document.getElementById( 'content-score' ) );
		hide( document.getElementById( 'keyword-score' ) );
	} );
} //end maybeHideYoast()

function addHiddenField( nonce: string ) {
	const form = document.getElementById( 'post' );
	if ( ! form ) {
		return;
	} //end if

	const nonceField = document.createElement( 'input' );
	nonceField.setAttribute( 'type', 'hidden' );
	nonceField.setAttribute( 'name', 'nelio-content-edit-post-nonce' );
	nonceField.setAttribute( 'value', nonce );
	form.appendChild( nonceField );

	const hidden = document.createElement( 'input' );
	hidden.setAttribute( 'type', 'hidden' );
	hidden.setAttribute( 'name', 'nelio-content-classic-values' );
	form.appendChild( hidden );
	listenToEditPostStore( ( values ) => {
		hidden.setAttribute( 'value', JSON.stringify( values ) );
	} );
} //end addHiddenField()

function maybeGenerateTimeline() {
	const arg = 'nc-auto-messages';
	const url = document.location.href;

	if ( ! hasQueryArg( url, arg ) ) {
		return;
	} //end if

	history.replaceState( null, '', removeQueryArgs( url, arg ) );
	const { generateTimeline } = dispatch( NC_EDIT_POST );
	void generateTimeline();
} //end maybeGenerateTimeline()
