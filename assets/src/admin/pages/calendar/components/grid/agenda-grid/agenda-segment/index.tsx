/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, select as doSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { padStart } from 'lodash';
import classnames from 'classnames';
import { useDrop } from 'react-dnd';
import {
	store as NC_CALENDAR,
	useItemDropper,
	useMinRowHeight,
} from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import { extractDateTimeValues } from '@nelio-content/utils';
import type { DraggableItemSummary } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { Actions } from './actions';
import { ItemList } from './item-list';

export type SegmentProps = {
	readonly day: string;
	readonly hour: number;
	readonly isHoveredByTask: boolean;
	readonly onHoveredByTask: ( isHovered: boolean ) => void;
};

export const Segment = ( {
	day,
	hour,
	isHoveredByTask,
	onHoveredByTask,
}: SegmentProps ): JSX.Element => {
	const onDropItem = useItemDropper( day, hour );
	const minHeight = useMinRowHeight();

	const draggingItem = useSelect( ( select ) =>
		select( NC_CALENDAR ).getDraggingItem()
	);
	const draggingItemType = draggingItem?.type ?? '';

	const now = useSelect( ( select ) => select( NC_DATA ).getUtcNow() );
	const type = getSegmentType( now, day, hour );
	const segment: DaySegment = { day, hour, type };

	const [ { isDirectlyHovered }, drop ] = useDrop<
		DraggableItemSummary,
		unknown,
		{ isDirectlyHovered: boolean }
	>( {
		accept: [ 'post', 'social', 'task', 'reusable-message' ],
		drop: onDropItem,
		canDrop: ( item ) =>
			canDropPost( item, segment ) ||
			canDropTask( item, segment ) ||
			canDropLinkedSocial( item, segment ) ||
			canDropReusable( item, segment ),
		collect: ( monitor ) => ( {
			isDirectlyHovered: monitor.canDrop() && monitor.isOver(),
		} ),
	} );

	useEffect( () => {
		onHoveredByTask( 'task' === draggingItemType && isDirectlyHovered );
	}, [ draggingItemType, isDirectlyHovered ] );

	const isHovered =
		'task' === draggingItemType ? isHoveredByTask : isDirectlyHovered;

	return (
		<div
			className={ classnames( {
				'nelio-content-calendar-agenda-hour-segment': true,
				'nelio-content-calendar-agenda-hour-segment--is-hovered':
					isHovered,
			} ) }
			ref={ drop }
			style={ { minHeight } }
		>
			<div className="nelio-content-calendar-agenda-hour-segment__header">
				<div
					className={ `nelio-content-calendar-agenda-hour-segment__label--${ type }` }
				>
					{ padStart( `${ hour }`, 2, '0' ) + ':00' }
				</div>

				{ 'past-segment' !== type && (
					<Actions
						day={ day }
						hour={ padStart( `${ hour }`, 2, '0' ) + ':00' }
					/>
				) }
			</div>

			<ItemList day={ day } hour={ hour } />
		</div>
	);
};

// =======
// HELPERS
// =======

type DaySegment = {
	readonly day: string;
	readonly hour: number;
	readonly type: 'past-segment' | 'current-segment' | 'future-segment';
};

function getSegmentType(
	utcNow: string,
	segmentDay: string,
	segmentHour: number
) {
	const dtv = extractDateTimeValues( utcNow );
	if ( ! dtv ) {
		return 'past-segment';
	} //end if

	const { dateValue, timeValue } = dtv;
	const segmentStart = segmentHour;
	const segmentEnd = segmentStart + 4;

	const today = dateValue;
	if ( segmentDay !== today ) {
		return segmentDay < today ? 'past-segment' : 'future-segment';
	} //end if

	const hour = parseInt( timeValue.substring( 0, 2 ) );
	if ( segmentEnd <= hour ) {
		return 'past-segment';
	} //end if

	if ( segmentStart <= hour && hour < segmentEnd ) {
		return 'current-segment';
	} //end if

	return 'future-segment';
} //end getSegmentType()

const canDropPost = ( item: DraggableItemSummary, segment: DaySegment ) =>
	'post' === item.type && 'future-segment' === segment.type;

const canDropReusable = ( item: DraggableItemSummary, segment: DaySegment ) =>
	'reusable-message' === item.type && 'future-segment' === segment.type;

const canDropTask = ( item: DraggableItemSummary, segment: DaySegment ) =>
	'task' === item.type &&
	( 'future-segment' === segment.type ||
		doSelect( NC_DATA ).getToday() === segment.day );

function canDropLinkedSocial(
	item: DraggableItemSummary,
	segment: DaySegment
) {
	if ( 'social' !== item.type ) {
		return false;
	} //end if

	const message = doSelect( NC_DATA ).getSocialMessage( item.id );
	if ( ! message ) {
		return false;
	} //end if

	const post = doSelect( NC_DATA ).getPost( message.postId );
	if ( ! post ) {
		return segment.type === 'future-segment';
	} //end if

	if ( ! post.date ) {
		return false;
	} //end if

	const dtv = extractDateTimeValues( post.date );
	if ( ! dtv ) {
		return false;
	} //end if

	const { timeValue } = dtv;
	const postDay = post.date.substring( 0, 10 );
	const postHour = Number.parseInt( timeValue.substring( 0, 2 ) );
	return (
		segment.type === 'future-segment' &&
		( segment.day > postDay ||
			( segment.day === postDay && segment.hour >= postHour + 4 ) )
	);
} //end canDropLinkedSocial()
