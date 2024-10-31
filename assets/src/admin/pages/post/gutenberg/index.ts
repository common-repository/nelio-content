/**
 * WordPress dependencies
 */
import { select, dispatch } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import { SocialMediaMetabox } from '@nelio-content/edit-post';
import { isEquivalent } from '@nelio-content/utils';
import type { Dict, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { init, listenToEditPostStore, renderMetaBox } from '../common';
import type { Args } from '../common';

import { initPlugin } from './plugin';
import { addListeners } from './listeners';
import { addSocialShareButtons } from './editor';

// Run this outside “initPage” to let Gutenberg know about this format.
addSocialShareButtons();

export async function initPage( args: Args ): Promise< void > {
	addCoreStoreSynchronizer();

	await init( args );
	initPlugin( {
		isQualityFullyIntegrated:
			args.settings.qualityAnalysis.isFullyIntegrated,
	} );

	renderMetaBox( 'nelio-content-social-media', SocialMediaMetabox );

	addListeners();
} //end initPage()

// =======
// HELPERS
// =======

function addCoreStoreSynchronizer() {
	listenToEditPostStore( ( values: Dict ) => {
		const { getEditedPostAttribute } = select( EDITOR );
		const oldValues = getEditedPostAttribute(
			// @ts-expect-error This post attribute has been registered by Nelio Content.
			'nelio_content'
		) as Maybe< Dict >;

		if ( ! oldValues ) {
			return;
		} //end if

		if ( isEquivalent( values, oldValues ) ) {
			return;
		} //end if

		const { getCurrentPost } = select( EDITOR );
		const { id } = getCurrentPost() as Dict;
		if ( ! id ) {
			return;
		} //end if

		const { editPost } = dispatch( EDITOR );
		// @ts-expect-error editPost should accept two arguments.
		void editPost( { nelio_content: values }, { undoIgnore: true } );
	} );
} //end addCoreStoreSynchronizer()
