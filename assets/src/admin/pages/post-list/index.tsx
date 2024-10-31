/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { render } from '@safe-wordpress/element';
import domReady from '@safe-wordpress/dom-ready';

/**
 * External dependencies
 */
import type { PostId } from '@nelio-content/types';

/**
 * External dependencies
 */
import { PremiumDialog } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { SocialTimeline } from './social-timeline';
import { SocialMediaLink } from './social-media-link';

domReady( () => {
	const links = Array.from(
		document.querySelectorAll< HTMLElement >( '.nelio-content-share-post' )
	);

	const layout = document.createElement( 'div' );
	document.body.appendChild( layout );
	render(
		<>
			<PremiumDialog />
			<SocialTimeline />
		</>,
		layout
	);

	links
		.map( ( l ) => [ l.dataset.postId, l.parentElement ] as const )
		.filter( ( l ): l is [ string, HTMLElement ] => !! l[ 0 ] )
		.map( ( [ n, e ] ) => [ Number.parseInt( n ) || 0, e ] as const )
		.filter( ( l ): l is [ PostId, HTMLElement ] => !! l[ 0 ] )
		.forEach( ( [ postId, element ] ) =>
			render( <SocialMediaLink postId={ postId } />, element )
		);
} );
