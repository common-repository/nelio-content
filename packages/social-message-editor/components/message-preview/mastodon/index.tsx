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
import { MaybeSharedLink } from './maybe-shared-link';
import type { PreviewAttributes } from '../../../hooks';

export const MastodonPreview = ( {
	activeProfile: { id: profileId, displayName, username },
	dateValue,
	image,
	schedule,
	textComputed,
	timeValue,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-mastodon-preview">
		<div className="nelio-content-social-message-mastodon-preview__profile">
			<SocialProfileIcon
				profileId={ profileId }
				isNetworkHidden={ true }
			/>

			<div className="nelio-content-social-message-mastodon-preview__name-info">
				<div className="nelio-content-social-message-mastodon-preview__display-name">
					{ displayName }
				</div>
				<div className="nelio-content-social-message-mastodon-preview__username">
					{ username }
				</div>
			</div>
		</div>

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

		{ 'image' === type ? (
			<img
				className="nelio-content-social-message-mastodon-preview__image"
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

		<div className="nelio-content-social-message-mastodon-preview__date">
			{ !! dateValue &&
				!! timeValue &&
				dateI18n(
					_x(
						'g:i A · d M Y',
						'text (mastodon preview date)',
						'nelio-content'
					),
					schedule
				) }
			{ !! dateValue &&
				! timeValue &&
				dateI18n(
					_x(
						'd M Y',
						'text (mastodon preview date)',
						'nelio-content'
					),
					schedule
				) }
			{ ! dateValue && _x( 'Someday', 'text', 'nelio-content' ) }
		</div>
	</div>
);
