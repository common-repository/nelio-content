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
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { MaybeSharedImage } from './maybe-shared-image';
import type { PreviewAttributes } from '../../../hooks';

export const GoogleMyBusinessPreview = ( {
	activeProfile: { id: profileId, displayName },
	image,
	schedule,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-gmb-preview">
		<div className="nelio-content-social-message-gmb-preview__profile-and-date">
			<SocialProfileIcon
				profileId={ profileId }
				isNetworkHidden={ true }
			/>

			<div className="nelio-content-social-message-gmb-preview__name">
				<div className="nelio-content-social-message-gmb-preview__display-name">
					{ displayName }
				</div>
			</div>

			<div className="nelio-content-social-message-gmb-preview__date">
				{ dateI18n(
					_x(
						'F j, Y',
						'text (Google My Business preview date)',
						'nelio-content'
					),
					schedule
				) }
			</div>
		</div>

		{ 'image' === type && !! image ? (
			<img
				className="nelio-content-social-message-gmb-preview__image"
				alt={ _x(
					'Image that will be shared with this message.',
					'text',
					'nelio-content'
				) }
				src={ image }
			/>
		) : (
			<MaybeSharedImage />
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
);
