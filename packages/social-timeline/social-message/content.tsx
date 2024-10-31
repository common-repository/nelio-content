/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { SocialMessageTextPreview } from '@nelio-content/components';
import { getCharLimitInNetwork } from '@nelio-content/networks';
import { computeSocialMessageText } from '@nelio-content/utils';
import type { Post, SocialNetworkName } from '@nelio-content/types';

export type ContentProps = {
	readonly network: SocialNetworkName;
	readonly post: Post;
	readonly text: string;
};

export const Content = ( {
	network,
	post,
	text,
}: ContentProps ): JSX.Element => {
	const textComputed = computeSocialMessageText(
		getCharLimitInNetwork( network ),
		post,
		text
	);

	return (
		<div className="nelio-content-social-message__content-wrapper">
			<SocialMessageTextPreview
				className="nelio-content-social-message__actual-content"
				placeholder=""
				linkBeautifier={ ( link ) => {
					link = link.replace( /^https?:\/\//i, '' );
					if ( -1 === link.indexOf( '/' ) ) {
						return link;
					} //end if

					const path = link.replace( /^[^/]*\//, '' );
					if ( path.length <= 10 ) {
						return link;
					} //end if

					const domain = link.replace( /\/.*$/, '' );
					return `${ domain }/${ path.substring( 0, 9 ) }…`;
				} }
				value={ textComputed }
			/>
		</div>
	);
};
