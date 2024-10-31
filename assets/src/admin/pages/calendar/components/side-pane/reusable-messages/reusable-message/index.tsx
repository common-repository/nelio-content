/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { useDrag } from 'react-dnd';
import { useItemDragTriggers } from '@nelio-content/calendar';
import { store as NC_DATA, useFeatureGuard } from '@nelio-content/data';
import { SocialProfileIcon } from '@nelio-content/components';
import { doesNetworkSupport } from '@nelio-content/networks';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import type {
	DraggableReusableMessageSummary,
	Maybe,
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ReusableMessageProps = {
	readonly id: ReusableSocialMessageId;
};

export const ReusableMessage = ( {
	id,
}: ReusableMessageProps ): JSX.Element | null => {
	const message = useSelect( ( select ) =>
		select( NC_DATA ).getReusableMessage( id )
	);

	const { summary, onDragStart, onDragEnd } = useDraggableSummary( message );
	const [ _, dragReference ] = useDrag(
		{
			type: summary.type,
			item: () => {
				onDragStart();
				return summary;
			},
			end: onDragEnd,
		},
		[ summary ]
	);

	const editGuard = useFeatureGuard( 'calendar/edit-reusable-messages' );
	const { openSocialMessageEditor: edit } = useDispatch( NC_SOCIAL_EDITOR );

	if ( ! message ) {
		return null;
	} //end if

	const onClick = editGuard(
		() =>
			!! message &&
			edit( message, {
				context: 'calendar',
				reusableMessage: message.id,
			} )
	);

	return (
		<div // eslint-disable-line
			ref={ dragReference }
			className="nelio-content-reusable-message"
			onClick={ () => void onClick() }
		>
			<SocialProfileIcon
				className="nelio-content-calendar-social-message__profile-icon"
				profileId={ message.profileId }
			/>

			<div className="nelio-content-calendar-social-message__content">
				{ doesNetworkSupport( 'text', message.network )
					? message.textComputed
					: getDefaultMessage( message.type ) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const DEFAULT_DRAGGABLE = { type: 'unknown', id: '' };
const useDraggableSummary = ( message: Maybe< ReusableSocialMessage > ) => {
	const item = useSelect(
		( select ): Maybe< DraggableReusableMessageSummary > => {
			const today = select( NC_DATA ).getToday();
			return message
				? {
						type: 'reusable-message',
						id: message.id,
						minDroppableDay: today,
				  }
				: undefined;
		}
	);
	const { onDragStart, onDragEnd } = useItemDragTriggers( item );
	return { summary: item ?? DEFAULT_DRAGGABLE, onDragStart, onDragEnd };
};

// =======
// HELPERS
// =======

function getDefaultMessage( type: ReusableSocialMessage[ 'type' ] ): string {
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
