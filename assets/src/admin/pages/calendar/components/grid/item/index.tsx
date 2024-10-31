/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';
import { useDrag } from 'react-dnd';
import {
	store as NC_CALENDAR,
	useItem,
	useItemDragTriggers,
} from '@nelio-content/calendar';
import {
	getPremiumCalendarItemView,
	getPremiumItemsMinDroppableDay,
	isItemTypeDraggable,
} from '@nelio-content/premium-hooks-for-pages';
import { store as NC_DATA } from '@nelio-content/data';
import { date } from '@nelio-content/date';
import type {
	DraggableItemSummary,
	EditorialTask,
	ItemSummary,
	Maybe,
	Post,
	PostId,
	PremiumItem,
	SocialMessage,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { Post as PostView } from './post';
import { SocialMessage as SocialMessageView } from './social-message';
import { Task as TaskView } from './task';
import { ExternalEvent as ExternalEventView } from './external-event';
import { InternalEvent as InternalEventView } from './internal-event';

export type ItemProps = {
	readonly itemType: ItemSummary[ 'type' ];
	readonly itemId: ItemSummary[ 'id' ];
};

const DEFAULT_DRAGGABLE = { type: 'unknown', id: '' };

export const Item = ( { itemType, itemId }: ItemProps ): JSX.Element | null => {
	const {
		isBlurred,
		isClickable,
		isDraggable,
		isDragging,
		isHighlighted,
		isLocked,
		isSynching,
	} = useItemStatus( itemType, itemId );
	const draggableItem = useDraggableItem( itemType, itemId );
	const { onDragStart, onDragEnd } = useItemDragTriggers( draggableItem );

	const di = draggableItem ?? DEFAULT_DRAGGABLE;
	const [ _, dragReference ] = useDrag(
		{
			type: di.type,
			item: () => {
				onDragStart();
				return di;
			},
			end: onDragEnd,
			canDrag: () => isDraggable,
		},
		[ di ]
	);

	const className = classnames( {
		'nelio-content-calendar-item': true,
		'nelio-content-calendar-item--is-blurred': isBlurred,
		'nelio-content-calendar-item--is-dragging': isDragging,
		'nelio-content-calendar-item--is-highlighted': isHighlighted,
		'nelio-content-calendar-item--is-locked': isLocked,
		'nelio-content-calendar-item--is-synching': isSynching,
	} );

	switch ( itemType ) {
		case 'post':
			return (
				<PostView
					className={ className }
					itemId={ itemId as PostId }
					dragReference={ dragReference }
					isClickable={ isClickable }
				/>
			);

		case 'social':
			return (
				<SocialMessageView
					className={ className }
					itemId={ itemId as Uuid }
					dragReference={ dragReference }
					isClickable={ isClickable }
				/>
			);

		case 'task':
			return (
				<TaskView
					className={ className }
					itemId={ itemId as Uuid }
					dragReference={ dragReference }
					isClickable={ isClickable }
				/>
			);

		case 'external-event':
			return (
				<ExternalEventView
					className={ className }
					itemId={ itemId as Uuid }
				/>
			);

		case 'internal-event':
			return (
				<InternalEventView
					className={ className }
					itemId={ itemId as Uuid }
					isClickable={ isClickable }
				/>
			);

		default: {
			const PremiumView = getPremiumCalendarItemView( itemType );
			return (
				<PremiumView
					className={ className }
					itemId={ itemId }
					dragReference={ dragReference }
					isClickable={ isClickable }
				/>
			);
		} //end case
	} //end switch
};

// =====
// HOOKS
// =====

const useItemStatus = (
	itemType: ItemSummary[ 'type' ],
	itemId: ItemSummary[ 'id' ]
) => {
	const canUserChangeDate = useCanUserChangeDate( itemType, itemId );
	const canUserView = useCanUserView( itemType, itemId );
	const canUserEdit = useCanUserEdit( itemType, itemId );

	return useSelect( ( select ) => {
		const {
			getDraggingItem,
			getHoverItem,
			isDragging,
			isHighlighted,
			isSynching,
		} = select( NC_CALENDAR );

		const isItemDragging = isDragging( itemType, itemId );
		const isItemHighlighted = isHighlighted( itemType, itemId );
		const isItemSynching = isSynching( itemType, itemId );

		const theresHighlightOtherThanThis =
			!! getHoverItem() && ! isItemHighlighted;
		const theresDraggingOtherThanThis =
			!! getDraggingItem() && ! isItemDragging;

		const isBlurred =
			[ 'post', 'social' ].includes( itemType ) &&
			! canUserEdit &&
			! isItemHighlighted;
		const isClickable = canUserView && ! isItemSynching;
		const isDraggable =
			canUserChangeDate &&
			! isItemSynching &&
			isItemTypeDraggable( itemType );

		return {
			isBlurred:
				isBlurred ||
				isItemSynching ||
				theresHighlightOtherThanThis ||
				theresDraggingOtherThanThis,
			isClickable,
			isDraggable,
			isDragging: isItemDragging,
			isHighlighted: isItemHighlighted,
			isLocked: ! isClickable && ! isDraggable,
			isSynching: isItemSynching,
		};
	} );
};

const useCanUserView = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
) => {
	const item = useItem( type, id );
	const editable = useCanUserEdit( type, id );
	return useSelect( ( select ): boolean => {
		select( NC_DATA );
		switch ( type ) {
			case 'post':
				const post = item as Maybe< Post >;
				return select( NC_DATA ).canCurrentUserViewPost( post );

			case 'social':
				const message = item as Maybe< SocialMessage >;
				return (
					editable ||
					!! message?.isFreePreview ||
					'publish' === message?.status
				);

			case 'task':
				return true;

			case 'external-event':
			case 'internal-event':
				return editable;

			default:
				const premiumItem = item as Maybe< PremiumItem >;
				return select( NC_DATA ).canCurrentUserViewPremiumItem(
					type,
					premiumItem
				);
		} //end switch
	} );
};

const useCanUserEdit = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
) => {
	const item = useItem( type, id );
	return useSelect( ( select ): boolean => {
		switch ( type ) {
			case 'post':
				const post = item as Maybe< Post >;
				return select( NC_DATA ).canCurrentUserEditPost( post );

			case 'social':
				const message = item as Maybe< SocialMessage >;
				return select( NC_DATA ).canCurrentUserEditSocialMessage(
					message
				);

			case 'task':
				const task = item as Maybe< EditorialTask >;
				return select( NC_DATA ).canCurrentUserEditTask( task );

			case 'internal-event':
				return true;

			case 'external-event':
				return false;

			default:
				const premiumItem = item as Maybe< PremiumItem >;
				return select( NC_DATA ).canCurrentUserEditPremiumItem(
					type,
					premiumItem
				);
		} //end switch
	} );
};

const useCanUserChangeDate = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
) => {
	const item = useItem( type, id );
	const editable = useCanUserEdit( type, id );

	if ( type === 'internal-event' ) {
		return false;
	} //end if

	if ( 'post' !== type ) {
		return editable;
	} //end if

	const post = item as Maybe< Post >;
	return editable && 'publish' !== post?.status;
};

const useDraggableItem = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): Maybe< DraggableItemSummary > => {
	const minDroppableDay = useMinDroppableDay( type, id );
	if ( 'post' !== type && 'social' !== type && 'task' !== type ) {
		return;
	} //end if

	return 'post' === type
		? { id: id as PostId, type, minDroppableDay }
		: { id: id as Uuid, type, minDroppableDay };
};

const useMinDroppableDay = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): string => {
	const item = useItem( type, id );
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );

	switch ( type ) {
		case 'post':
			const post = item as Maybe< Post >;
			return post?.date && post?.date < today
				? post?.date ?? today
				: today;

		case 'social':
			const message = item as Maybe< SocialMessage >;
			return getMinSchedule( today, message );

		case 'task':
		case 'internal-event':
		case 'external-event':
			return today;

		default:
			return (
				getPremiumItemsMinDroppableDay(
					type,
					item as Maybe< PremiumItem >
				) ?? today
			);
	} //end switch
};

// =======
// HELPERS
// =======

function getMinSchedule( today: string, message: Maybe< SocialMessage > ) {
	if ( ! message ) {
		return today;
	} //end if

	const { dateType, dateValue, schedule } = message;
	if ( 'exact' === dateType ) {
		return today;
	} //end if

	if ( '0' === dateValue ) {
		return date( 'Y-m-d', schedule );
	} //end if

	// eslint-disable-next-line @typescript-eslint/no-unsafe-unary-minus
	return date( 'Y-m-d', moment( schedule ).add( -dateValue, 'days' ) );
} //end getMinSchedule()
