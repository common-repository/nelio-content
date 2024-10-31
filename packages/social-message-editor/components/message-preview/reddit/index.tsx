/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SocialMessageTextPreview } from '@nelio-content/components';
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { MaybeSharedImage } from './maybe-shared-image';
import type { PreviewAttributes } from '../../../hooks';

export const RedditPreview = ( {
	activeProfile: { displayName },
	image,
	schedule,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-reddit-preview">
		<div className="nelio-content-social-message-reddit-preview__text-and-image">
			<div className="nelio-content-social-message-reddit-preview__text-wrapper">
				<div className="nelio-content-social-message-reddit-preview__profile-and-date">
					{ sprintf(
						/* translators: 1 -> username. 2 -> date */
						_x(
							'Published by %1$s. %2$s',
							'text (reddit)',
							'nelio-content'
						),
						displayName,
						dateI18n(
							_x(
								'F j, Y',
								'text (Reddit preview date)',
								'nelio-content'
							),
							schedule
						)
					) }
				</div>

				<SocialMessageTextPreview
					value={ textComputed }
					linkBeautifier={ shortenLink }
				/>
				<div className="nelio-content-social-message-reddit-preview__link">
					{ shortenLink( lastLink( textComputed ) ).replace(
						/^https?:\/\//,
						''
					) }
				</div>
			</div>

			<div className="nelio-content-social-message-reddit-preview__image-wrapper">
				{ 'image' === type && !! image ? (
					<img
						className="nelio-content-social-message-reddit-preview__image"
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
			</div>
		</div>
	</div>
);

// =======
// HELPERS
// =======

const shortenLink = ( link: string ) => {
	const result = link.replace( /^(https?:\/\/[^\/]+.{0,16}).*/, '$1' );
	return result === link ? result : result + '…';
};

const lastLink = ( text: string ) => {
	const links = ` ${ text } `.match( /\s(https?:\/\/[^ ]*)\s/g ) || [];
	return links[ links.length - 1 ] || '';
};
