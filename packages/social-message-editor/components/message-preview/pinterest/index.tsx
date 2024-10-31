/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
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

export const PinterestPreview = ( {
	activeProfile: { id: profileId, displayName = 'Nelio' },
	image,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-pinterest-preview">
		<div className="nelio-content-social-message-pinterest-preview__image">
			{ 'image' === type || 'auto-image' === type ? (
				<img
					className="nelio-content-social-message-pinterest-preview__actual-image"
					alt={ _x(
						'Image that will be shared with this message.',
						'text',
						'nelio-content'
					) }
					src={ image }
				/>
			) : (
				<div className="nelio-content-social-message-pinterest-preview__image-placeholder">
					<Dashicon
						className="nelio-content-social-message-pinterest-preview__image-icon"
						icon="format-image"
					/>
				</div>
			) }
		</div>

		<div className="nelio-content-social-message-pinterest-preview__content">
			<MaybeSharedLink />

			<SocialMessageTextPreview
				value={ textComputed }
				linkBeautifier={ ( link ) =>
					link.replace( /https?:\/\/([^\/]+).*/, '$1' )
				}
			/>

			<div className="nelio-content-social-message-pinterest-preview__profile">
				<SocialProfileIcon
					profileId={ profileId }
					isNetworkHidden={ true }
				/>
				<strong>{ displayName }</strong>
			</div>
		</div>
	</div>
);
