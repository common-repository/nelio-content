/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import {
	doesNetworkRequire,
	doesNetworkSupport,
} from '@nelio-content/networks';
import { getAllUrls } from '@nelio-content/utils';
import type { SocialProfile } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { BlueskyPreview } from './bluesky';
import { FacebookPreview } from './facebook';
import { GoogleMyBusinessPreview } from './gmb';
import { InstagramPreview } from './instagram';
import { LinkedInPreview } from './linkedin';
import { MastodonPreview } from './mastodon';
import { MediumPreview } from './medium';
import { NoPreview } from './no-preview';
import { PinterestPreview } from './pinterest';
import { RedditPreview } from './reddit';
import { TelegramPreview } from './telegram';
import { ThreadsPreview } from './threads';
import { TumblrPreview } from './tumblr';
import { TwitterPreview } from './twitter';

import {
	useActiveSocialNetwork,
	usePreview,
	usePreviewAttributes,
	useSharedLinkLoaderEffect,
} from '../../hooks';
import type { PreviewAttributes } from '../../hooks';

export const MessagePreview = (): JSX.Element | null => {
	const [ isVisible ] = usePreview();
	const attrs = usePreviewAttributes();
	const urls = getAllUrls( attrs.textComputed );
	const activeNetwork = useActiveSocialNetwork();

	useSharedLinkLoaderEffect( urls );

	const isRequired = doesNetworkRequire( 'preview', activeNetwork );
	if ( ! isRequired ) {
		if ( ! isVisible ) {
			return null;
		} //end if

		const isSupported = doesNetworkSupport( 'preview', activeNetwork );
		if ( ! isSupported ) {
			return null;
		} //end if
	} //end if

	if ( ! attrs.activeProfile ) {
		return <NoPreview />;
	} //end if

	const PreviewComponent = getPreviewComponent( attrs.activeProfile );
	if ( ! PreviewComponent ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-social-message-preview">
			<PreviewComponent
				{ ...{ ...attrs, activeProfile: attrs.activeProfile } }
			/>
		</div>
	);
};

// =======
// HELPERS
// =======

function getPreviewComponent(
	activeProfile: SocialProfile
): ( ( attrs: PreviewAttributes ) => JSX.Element ) | null {
	switch ( activeProfile.network ) {
		case 'bluesky':
			return BlueskyPreview;

		case 'twitter':
			return TwitterPreview;

		case 'facebook':
			return FacebookPreview;

		case 'gmb':
			return GoogleMyBusinessPreview;

		case 'linkedin':
			return LinkedInPreview;

		case 'instagram':
			return InstagramPreview;

		case 'pinterest':
			return PinterestPreview;

		case 'reddit':
			return RedditPreview;

		case 'telegram':
			return TelegramPreview;

		case 'medium':
			return MediumPreview;

		case 'threads':
			return ThreadsPreview;

		case 'tiktok':
			return null;

		case 'tumblr':
			return TumblrPreview;

		case 'mastodon':
			return MastodonPreview;
	} //end switch
} //end getPreviewComponent()
