/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { SocialProfileIcon } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type {
	SocialMessage as SocialMessageInstance,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { Actions } from './actions';
import { Content } from './content';
import { PublicationDate } from './publication-date';
import { RecurrenceSummary } from './recurrence-summary';
import { Location } from './location';
import type { ActionsProps } from './actions';

export type SocialMessageProps = {
	readonly messageId: Uuid;
} & Omit< ActionsProps, 'message' >;

export const SocialMessage = ( {
	messageId,
	deleteMessage,
	isBeingDeleted,
	isTimelineBusy,
	post,
}: SocialMessageProps ): JSX.Element | null => {
	const { openPremiumDialog } = useDispatch( NC_DATA );
	const message = useSelect( ( select ) =>
		select( NC_DATA ).getSocialMessage( messageId )
	);

	if ( ! message ) {
		return null;
	} //end if

	const {
		auto,
		dateType,
		dateValue,
		id,
		isFreePreview,
		network,
		profileId,
		schedule,
		source,
		status,
		targetName,
		text,
		timeType,
		timeValue,
		type,
	} = message;

	const isError = 'error' === status;
	const isImageType = 'image' === type || 'auto-image' === type;
	const isVideoType = 'video' === type;

	return (
		<div
			className={ classnames( {
				'nelio-content-social-message': true,
				'nelio-content-social-message--is-auto': !! auto,
				'nelio-content-social-message--is-error': isError,
				'nelio-content-social-message--is-free-preview': isFreePreview,
			} ) }
			data-social-message-id={ id }
		>
			{ isImageType && (
				<Dashicon
					className="nelio-content-social-message__image-type-icon"
					icon="format-image"
				/>
			) }

			{ isVideoType && (
				<Dashicon
					className="nelio-content-social-message__video-type-icon"
					icon="video-alt2"
				/>
			) }

			<div className="nelio-content-social-message__profile-and-location">
				<SocialProfileIcon
					className="nelio-content-social-message__profile-icon"
					profileId={ profileId }
				/>
				<Location
					network={ network }
					profileId={ profileId }
					targetName={ targetName }
				/>
			</div>
			<Content
				network={ network }
				post={ post }
				text={ text || getDefaultMessage( type ) }
			/>
			<RecurrenceSummary messageId={ messageId } />
			<PublicationDate
				isBeingDeleted={ isBeingDeleted }
				dateType={ dateType }
				dateValue={ dateValue }
				schedule={ schedule }
				timeType={ timeType }
				timeValue={ timeValue }
				source={ source }
				postStatus={ post.status }
			/>
			<Actions
				message={ message }
				deleteMessage={ deleteMessage }
				isTimelineBusy={ isTimelineBusy }
				isBeingDeleted={ isBeingDeleted }
				post={ post }
			/>

			{ isFreePreview && (
				<button
					className="nelio-content-social-message__free-preview-button"
					onClick={ () => openPremiumDialog( 'raw/free-previews' ) }
				>
					<div className="nelio-content-social-message__premium-badge components-button nelio-content-social-media-timeline-period__add-button nelio-content-premium-feature-button nelio-content-premium-feature-button--is-premium is-small has-text has-icon">
						<span>
							<Dashicon icon="lock" />
						</span>
						<span>
							{ _x( 'Premium', 'text', 'nelio-content' ) }
						</span>
					</div>
				</button>
			) }
		</div>
	);
};

// =======
// HELPERS
// =======

function getDefaultMessage( type: SocialMessageInstance[ 'type' ] ): string {
	switch ( type ) {
		case 'auto-image':
		case 'text':
			return '';

		case 'image':
			return _x( '(image)', 'text', 'nelio-content' );

		case 'video':
			return _x( '(video)', 'text', 'nelio-content' );
	} //end switch
} //end getDefaultMessage()
