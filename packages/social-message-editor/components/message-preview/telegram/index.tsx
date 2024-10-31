/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SocialMessageTextPreview } from '@nelio-content/components';
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { MaybeSharedLink } from './maybe-shared-link';
import type { PreviewAttributes } from '../../../hooks';

export const TelegramPreview = ( {
	image,
	schedule,
	textComputed,
	type,
}: PreviewAttributes ): JSX.Element => (
	<div className="nelio-content-social-message-telegram-preview">
		{ 'image' === type && (
			<img
				className="nelio-content-social-message-telegram-preview__image"
				alt={ _x(
					'Image that will be shared with this message.',
					'text',
					'nelio-content'
				) }
				src={ image }
			/>
		) }

		<SocialMessageTextPreview value={ textComputed } />

		{ 'image' !== type && <MaybeSharedLink /> }

		<div className="nelio-content-social-message-telegram-preview__date">
			<Dashicon icon="visibility" />
			{ dateI18n( ' H:i', schedule ) }
		</div>
	</div>
);
