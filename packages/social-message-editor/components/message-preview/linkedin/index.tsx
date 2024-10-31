/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import md5 from 'md5';
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

export const LinkedInPreview = ( {
	activeProfile: { id: profileId, displayName },
	image,
	schedule,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-linkedin-preview">
		<div className="nelio-content-social-message-linkedin-preview__profile-and-date">
			<SocialProfileIcon
				profileId={ profileId }
				isNetworkHidden={ true }
			/>

			<div className="nelio-content-social-message-linkedin-preview__name-and-date">
				<div className="nelio-content-social-message-linkedin-preview__display-name">
					{ displayName }
				</div>
				<div className="nelio-content-social-message-linkedin-preview__date">
					{ dateI18n(
						_x(
							'F j, Y',
							'LinkedIn preview date',
							'nelio-content'
						),
						schedule
					) }
				</div>
			</div>
		</div>

		<SocialMessageTextPreview
			value={ textComputed }
			linkBeautifier={ ( link ) => 'https://lnkd.in/' + hash( link ) }
		/>

		{ 'image' === type ? (
			<img
				className="nelio-content-social-message-linkedin-preview__image"
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
	</div>
);

// =======
// HELPERS
// =======

const hash = ( link: string ): string => {
	return md5( link ).substring( 0, 6 );
};
