/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { RichTextToolbarButton } from '@safe-wordpress/block-editor';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { registerFormatType, toggleFormat } from '@safe-wordpress/rich-text';
import type { RichTextFormat, RichTextValue } from '@safe-wordpress/rich-text';

/**
 * External dependencies
 */
import { capitalize, find, uniq, filter, slice, trim } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { useDisabledProfiles } from '@nelio-content/edit-post';
import { isEmpty, isUrl } from '@nelio-content/utils';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { createSocialMessageUsingSelection } from '../common';
import PluginIcon from '~/nelio-content-images/logo.svg';

const HIGHLIGHT = 'nelio-content/highlight';
const SHARE = 'nelio-content/share';

export function addSocialShareButtons(): void {
	registerFormatType( HIGHLIGHT, {
		name: HIGHLIGHT,
		title: _x( 'Social Media Highlight', 'text', 'nelio-content' ),
		// eslint-disable-next-line
		tagName: 'ncshare' as any,
		className: null,
		edit: HighlightButton,
		interactive: false,
	} );

	registerFormatType( SHARE, {
		name: SHARE,
		title: _x( 'Share', 'command', 'nelio-content' ),
		tagName: 'span',
		className: 'nc-share',
		edit: ShareButton,
		interactive: false,
	} );
} //end addSocialShareButtons()

const HighlightButton = ( {
	isActive,
	value,
	onChange,
}: {
	readonly isActive: boolean;
	readonly value: RichTextValue;
	readonly onChange: ( v: RichTextValue ) => void;
} ) => (
	<RichTextToolbarButton
		icon={ <PluginIcon /> }
		title={ _x( 'Social Media Highlight', 'text', 'nelio-content' ) }
		onClick={ () => onChange( toggleFormat( value, { type: HIGHLIGHT } ) ) }
		isActive={ isActive }
	/>
);

const ShareButton = ( { value }: { readonly value: RichTextValue } ) => {
	const profiles = useSelect( ( select ) =>
		select( NC_DATA ).getSocialProfileIds()
	);
	const disabled = useDisabledProfiles();
	const areThereAvailableProfiles = disabled.length < profiles.length;

	return (
		<RichTextToolbarButton
			icon="share"
			title={ _x( 'Share', 'command', 'nelio-content' ) }
			isDisabled={
				! isThereSelectedText( value ) || ! areThereAvailableProfiles
			}
			onClick={ () =>
				createSocialMessageUsingSelection(
					getText( value ),
					extractLinks( value )
				)
			}
		/>
	);
};

function isThereSelectedText( value: RichTextValue ) {
	return ! isEmpty( getText( value ) );
} //end isThereSelectedText()

function getText( value: RichTextValue ) {
	const text = trim( value.text.substring( value.start ?? 0, value.end ) );
	return capitalize( text[ 0 ] ) + text.substring( 1 );
} //end getText()

function extractLinks( value: RichTextValue ): ReadonlyArray< Url > {
	const charFormats = slice( value.formats, value.start, value.end ) ?? [];
	return uniq( filter( charFormats.map( extractReference ) ) ).filter(
		isUrl
	);
} //end extractLinks()

function extractReference( formats?: ReadonlyArray< RichTextFormat > ): string {
	const link = find( formats, { type: 'core/link' } );
	return link?.attributes?.url ?? '';
} //end extractReference()
