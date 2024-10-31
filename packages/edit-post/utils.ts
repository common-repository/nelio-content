/**
 * WordPress dependencies
 */
import {
	create as createRichText,
	slice as sliceRichText,
	toHTMLString,
} from '@safe-wordpress/rich-text';
import { select as doSelect } from '@safe-wordpress/data';
import type { RichTextFormat, RichTextValue } from '@safe-wordpress/rich-text';

/**
 * External dependencies
 */
import { drop, dropRight, map, union, uniq, zip } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { Highlight, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from './store';

const CONTENT_NODES = [ 'p', 'h1', 'h2', 'h3', 'h4', 'li' ];
const NESTED_CONTENT_SELECTORS = CONTENT_NODES.reduce(
	( acc, s1 ) => [
		...acc,
		...CONTENT_NODES.map( ( s2 ) => `${ s1 } ${ s2 }` ),
	],
	[] as ReadonlyArray< string >
).join( ', ' );

export function getDisabledProfiles(): ReadonlyArray< Uuid > {
	const { isSubscribed, getProfilesWithMessagesRelatedToPost } =
		doSelect( NC_DATA );
	if ( isSubscribed() ) {
		return [];
	} //end if
	const { getPost } = doSelect( NC_EDIT_POST );
	const post = getPost();
	return getProfilesWithMessagesRelatedToPost( post.id );
} //end getDisabledProfiles()

export function processHtml( html = '' ): {
	readonly clean: string;
	readonly highlights: ReadonlyArray< Highlight >;
	readonly top: ReadonlyArray< string >;
} {
	const div = divify( html );
	const contentNodes = Array.from(
		div.querySelectorAll< HTMLElement >( CONTENT_NODES.join( ',' ) )
	);
	return {
		clean: map( contentNodes, textContent ).join( '\n\n' ),
		highlights: getHighlights( contentNodes ),
		top: union(
			map( div.getElementsByTagName( 'h1' ), textContent ),
			map( div.getElementsByTagName( 'h2' ), textContent ),
			map( div.getElementsByTagName( 'h3' ), textContent ),
			map( div.getElementsByTagName( 'strong' ), textContent )
		),
	};
} //end processHtml()

// =======
// HELPERS
// =======

function divify( html: string ) {
	const node = document.createElement( 'div' );
	node.innerHTML = html;

	const selector = `${ NESTED_CONTENT_SELECTORS }, ncshare ncshare`;
	let sel: HTMLElement | null;
	do {
		sel = node.querySelector( selector );
		unwrap( sel );
	} while ( sel );

	return node;
} //end divify()

function unwrap( node: HTMLElement | null ) {
	if ( ! node ) {
		return;
	} //end if
	while ( node.firstChild ) {
		node.parentElement?.insertBefore( node.firstChild, node );
	} //end while
	node.parentElement?.removeChild( node );
} //end unwrap()

function textContent( node: HTMLElement ) {
	return node?.textContent?.replace( /\s+/g, ' ' ) || '';
} //end textContent()

function getHighlights( nodes: ReadonlyArray< HTMLElement > ) {
	const highlights = union(
		...map( nodes, ( node ) => {
			const rt = createRichText( { element: node } );
			return splitBlockShares( rt ).map( htmlifyBlockShare );
		} )
	);
	return map( highlights, ( html ) => ( {
		html,
		text: html.replace( /<[^>]*>/g, '' ),
	} ) );
} //end getHighlights()

function splitBlockShares( richText: RichTextValue ) {
	const sameType = (
		a?: ReadonlyArray< RichTextFormat >,
		b?: ReadonlyArray< RichTextFormat >
	) => {
		return (
			( isShareFormat( a ) && isShareFormat( b ) ) ||
			( ! isShareFormat( a ) && ! isShareFormat( b ) )
		);
	};

	const splits = uniq(
		push(
			richText.formats.reduce(
				( acc, c, i, a ) => {
					if ( ! sameType( a[ i - 1 ], c ) ) {
						acc = push( acc, i );
					} //end if
					if ( ! sameType( c, a[ i + 1 ] ) ) {
						acc = push( acc, i + 1 );
					} //end if
					return acc;
				},
				[ 0 ]
			),
			richText.formats.length
		)
	);

	const intervals = zip( dropRight( splits, 1 ), drop( splits, 1 ) );
	return intervals
		.map( ( [ s, e ] ) => sliceRichText( richText, s, e ) )
		.filter( ( rt ) => rt.formats.some( isShareFormat ) );
} //end splitBlockShares()

function push< T >( a: T[], v: T ): T[] {
	a.push( v );
	return a;
}

function htmlifyBlockShare( richText: RichTextValue ) {
	type Href = string;
	const linkFormats = richText.formats.reduce(
		( acc, formats ) => {
			const href = getLinkUrl( formats );
			if ( href ) {
				acc[ href ] = [ { type: 'a', attributes: { href } } ];
			} //end if
			return acc;
		},
		{ '': [] } as Record< Href, RichTextFormat[] >
	);

	richText = {
		...richText,
		formats: richText.formats.map(
			( formats ) => linkFormats[ getLinkUrl( formats ) ] || []
		),
	};
	return toHTMLString( { value: richText } );
} //end htmlifyBlockShare()

const isShareFormat = ( f?: ReadonlyArray< RichTextFormat > ) =>
	!! f?.some(
		( { type } ) => 'ncshare' === type || 'nelio-content/highlight' === type
	);

const isLinkFormat = ( f: RichTextFormat ) =>
	( 'a' === f.type && !! f.attributes?.href ) ||
	( 'core/link' === f.type && !! f.attributes?.url );

const getLinkUrl = ( formats?: ReadonlyArray< RichTextFormat > ): string => {
	const attributes = formats?.find( isLinkFormat )?.attributes;
	return attributes?.href ?? attributes?.url ?? '';
};
