/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { store as EDITOR } from '@wordpress/editor';

/**
 * External dependencies
 */
import jQuery from 'jquery';
import { isEquivalent } from '@nelio-content/utils';
import type { Dict, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { init, listenToEditPostStore } from '../common';
import type { Args } from '../common';
import { initSections } from './sections';
import { addListeners } from './listeners';
import { isElementor } from './listeners/types';
import './style.scss';

jQuery( window ).on( 'load', function () {
	const $panelButton = jQuery( '#elementor-panel-footer-nelio-content' );
	const $modal = jQuery( '#elementor-nelio-content' );
	const $modalCloseButton = jQuery( '#elementor-nelio-content__close' );

	$panelButton.insertBefore( '#elementor-panel-footer-responsive' );
	$modal.insertBefore( '#elementor-navigator' );

	addTooltip( $panelButton as ExtendedJQueryElement );
	addInteractivity( $modal as ExtendedJQueryElement );

	$panelButton.on( 'click', () => $modal.toggle() );
	$modalCloseButton.on( 'click', () => $modal.toggle() );
} );

export async function initPage( args: Args ): Promise< void > {
	args = {
		...args,
		settings: {
			...args.settings,
			isElementorEditor: true,
		},
	};

	addCoreStoreSynchronizer();

	await init( args );

	initSections();
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

function addTooltip( $el: ExtendedJQueryElement ) {
	$el.tipsy( {
		gravity: 's',
		offset: $el.data( 'tooltip-offset' ),
		title: () => $el.data( 'tooltip' ) as string,
	} );
} //end addTooltip()

function addInteractivity( $el: ExtendedJQueryElement ) {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	$el.draggable( {
		iframeFix: true,
		handle: '#elementor-nelio-content__header',
	} );

	$el.resizable( {
		handles: 'all',
		containment: 'document',
		minWidth: 280,
		maxWidth: 500,
		minHeight: 240,
		start: () =>
			elementor.$previewWrapper.addClass( 'ui-resizable-resizing' ),
		stop: () =>
			elementor.$previewWrapper.removeClass( 'ui-resizable-resizing' ),
	} );
} //end addInteractivity()

type ExtendedJQueryElement = JQuery< HTMLElement > & {
	readonly tipsy: ( options: Dict ) => void;
	readonly draggable: ( options: Dict ) => void;
	readonly resizable: ( options: Dict ) => void;
};
