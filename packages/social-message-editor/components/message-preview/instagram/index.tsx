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
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import type { PreviewAttributes } from '../../../hooks';

export const InstagramPreview = ( {
	activeProfile: { id: profileId, displayName },
	image,
	schedule,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-instagram-preview">
		<div className="nelio-content-social-message-instagram-preview__image">
			{ 'image' === type || 'auto-image' === type ? (
				<img
					className="nelio-content-social-message-instagram-preview__actual-image"
					alt={ _x(
						'Image that will be shared with this message.',
						'text',
						'nelio-content'
					) }
					src={ image }
				/>
			) : (
				<div className="nelio-content-social-message-instagram-preview__image-placeholder">
					<Dashicon
						className="nelio-content-social-message-instagram-preview__image-icon"
						icon="format-image"
					/>
				</div>
			) }
		</div>

		<div className="nelio-content-social-message-instagram-preview__content">
			<div className="nelio-content-social-message-instagram-preview__profile-and-name">
				<SocialProfileIcon
					profileId={ profileId }
					isNetworkHidden={ true }
				/>

				<div className="nelio-content-social-message-instagram-preview__display-name">
					{ displayName }
				</div>
			</div>

			<SocialMessageTextPreview
				value={ textComputed }
				linkBeautifier={ ( link ) =>
					link.replace( /https?:\/\/([^\/]+).*/, '$1' )
				}
			/>

			<div className="nelio-content-social-message-instagram-preview__date">
				{ dateI18n(
					_x(
						'F j, Y',
						'text (Instagram preview date)',
						'nelio-content'
					),
					schedule
				) }
			</div>
		</div>
	</div>
);
