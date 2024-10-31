/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	SocialMessageTextPreview,
	SocialProfileIcon,
} from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { MaybeSharedLink } from './maybe-shared-link';
import type { PreviewAttributes } from '../../../hooks';

export const TumblrPreview = ( {
	activeProfile: { id: profileId, username },
	image,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-tumblr-preview">
		<div className="nelio-content-social-message-tumblr-preview__profile">
			<SocialProfileIcon
				profileId={ profileId }
				isNetworkHidden={ true }
			/>
		</div>

		<div className="nelio-content-social-message-tumblr-preview__wrapper">
			<div className="nelio-content-social-message-tumblr-preview__name">
				{ username }
			</div>

			{ 'image' === type ? (
				<img
					className="nelio-content-social-message-tumblr-preview__image"
					alt={ _x(
						'Image that will be shared with this message.',
						'text',
						'nelio-content'
					) }
					src={ image }
				/>
			) : (
				<MaybeSharedLink />
			) }

			<SocialMessageTextPreview
				value={ textComputed }
				linkBeautifier={ ( link ) => {
					const result = link.replace(
						/^(https?:\/\/[^\/]+.{0,15}).*/,
						'$1'
					);
					if ( result === link ) {
						return result.replace( /^https?:\/\//, '' );
					} //end if
					return result.replace( /^https?:\/\//, '' ) + '…';
				} }
			/>
		</div>
	</div>
);
