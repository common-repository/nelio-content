/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';

export type SocialMessageTextPreviewProps = {
	readonly className?: string;
	readonly linkBeautifier?: ( link: string ) => string;
	readonly value: string;
	readonly placeholder?: string;
};

export const SocialMessageTextPreview = ( {
	className = 'nelio-content-computed-text-preview',
	linkBeautifier = ( link ) => link,
	value,
	placeholder = _x( 'Your status update…', 'text', 'nelio-content' ),
}: SocialMessageTextPreviewProps ): JSX.Element => (
	<div
		className={ `${ className } ${ className }--${
			!! value ? 'valid' : 'empty'
		}` }
	>
		{ !! value ? stylize( value, linkBeautifier, className ) : placeholder }
	</div>
);

// =======
// HELPERS
// =======

const stylize = (
	text: string,
	linkBeautifier: ( l: string ) => string,
	className: string
) => {
	text = ` ${ text } `;
	text = fixNewLines( text );

	text = escapeInterpolateComponentPlaceholders( text );
	text = wrapLinks( text );
	text = beautifyLinks( text, linkBeautifier );
	text = wrapHashTags( text );
	text = wrapMentions( text );
	text = replaceNewLines( text );

	text = trim( text );
	text = wrapPlainText( text );

	// NOTE. We need different tag types to use CSS pseudo-selectors such as :last-of-type.
	return createInterpolateElement( text, {
		link: (
			<em
				className={ `nelio-content-preview-reset ${ className }__link` }
			></em>
		),
		hash: (
			<strong
				className={ `nelio-content-preview-reset ${ className }__hash` }
			></strong>
		),
		mention: (
			<span
				className={ `nelio-content-preview-reset ${ className }__mention` }
			></span>
		),
		plain: (
			<span
				className={ `nelio-content-preview-reset ${ className }__plain` }
			></span>
		),
		newline: <br />,
	} );
};

const fixNewLines = ( text: string ) => text.replace( /\r?\n/g, '\n' );

const escapeInterpolateComponentPlaceholders = ( text: string ) =>
	text
		.replace( new RegExp( '<', 'g' ), '<\u2060' )
		.replace( new RegExp( '>', 'g' ), '\u2060>' );

const wrapLinks = ( text: string ) =>
	text.replace( /(\s)(https?:\/\/[^\s]+)/g, `$1<link>$2 </link>` );

const beautifyLinks = (
	text: string,
	linkBeautifier: ( l: string ) => string
) => {
	const links = text.match( /https?:\/\/[^\s]+/g ) || [];
	links.forEach( ( link ) => {
		text = text.replace( `${ link } `, linkBeautifier( link ) );
	} );
	return text;
};

const wrapHashTags = ( text: string ) =>
	text.replace( TWITTER_HASHTAG_REGEX, `$1<hash>$2</hash>` );

const wrapMentions = ( text: string ) =>
	text.replace( TWITTER_MENTION_REGEX, `$1<mention>$2</mention>` );

const wrapPlainText = ( text: string ) => {
	text = text.replace( /({{|}})/g, ( x ) =>
		x === '{{' ? '</plain>{{' : '}}<plain>'
	);
	text = `<plain>${ text }</plain>`;
	text = text.replace( /<plain><\/plain>/g, '' );
	return text;
};

const replaceNewLines = ( text: string ) =>
	text.replace( / *\n */g, `<newline/>` );

const TWITTER_HASHTAG_REGEX =
	/([\s.,:;{}[\]¡¿?"'“”«»‘’:;/\-])(#[^\s.,:;{}[\]¡!¿?"'“”«»‘’:;&@#\-]+)/g;
const TWITTER_MENTION_REGEX =
	/([\s.,:;{}[\]¡¿?"'“”«»‘’:;/\-])(@[^\s.,:;{}[\]¡!¿?"'“”«»‘’:;&@#\-]+)/g;
