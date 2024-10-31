/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useItem, useItemHoverListeners } from '@nelio-content/calendar';
import { SocialProfileIcon } from '@nelio-content/components';
import { doesNetworkSupport } from '@nelio-content/networks';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import { isRecurringMessage } from '@nelio-content/utils';
import type { LegacyRef } from 'react';
import type {
	Maybe,
	SocialMessage as SocialMessageInstance,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SocialMessageContent } from './social-message-content';

export type SocialMessageProps = {
	readonly className?: string;
	readonly itemId: Uuid;
	readonly dragReference: LegacyRef< HTMLDivElement >;
	readonly isClickable: boolean;
};

export const SocialMessage = ( {
	className = '',
	itemId,
	dragReference,
	isClickable,
}: SocialMessageProps ): JSX.Element | null => {
	const message = useItem(
		'social',
		itemId
	) as Maybe< SocialMessageInstance >;

	const { openSocialMessageEditor: edit } = useDispatch( NC_SOCIAL_EDITOR );
	const onClick = () =>
		!! message && isClickable && edit( message, { context: 'calendar' } );
	const { onMouseEnter, onMouseLeave } = useItemHoverListeners(
		'social',
		itemId
	);

	if ( ! message ) {
		return null;
	} //end if

	const {
		auto,
		isFreePreview,
		network,
		profileId,
		schedule,
		status,
		text,
		textComputed,
		type,
	} = message;

	return (
		<div // eslint-disable-line
			role={ _x( 'Social Message', 'text', 'nelio-content' ) }
			className={ classnames( {
				'nelio-content-calendar-social-message': true,
				'nelio-content-calendar-social-message--is-auto': !! auto,
				[ `nelio-content-calendar-social-message--is-${ network }` ]:
					true,
				[ `nelio-content-calendar-social-message--is-${ status }` ]:
					true,
				'nelio-content-calendar-social-message--is-free-preview':
					isFreePreview,
				[ className ]: !! className,
			} ) }
			onClick={ () => void onClick() }
			data-item-id={ itemId }
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
			ref={ dragReference }
		>
			{ !! isFreePreview && (
				<div className="nelio-content-calendar-social-message__mode-icon">
					<Dashicon icon="lock" />
				</div>
			) }

			{ ! isFreePreview && isRecurringMessage( message ) && (
				<div className="nelio-content-calendar-social-message__mode-icon">
					<Dashicon icon="controls-repeat" />
				</div>
			) }

			<SocialProfileIcon
				className="nelio-content-calendar-social-message__profile-icon"
				profileId={ profileId }
			/>

			<SocialMessageContent
				className="nelio-content-calendar-social-message__content"
				message={
					doesNetworkSupport( 'text', network )
						? textComputed
						: text || getDefaultMessage( type )
				}
				schedule={ schedule ?? '' }
			/>
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
