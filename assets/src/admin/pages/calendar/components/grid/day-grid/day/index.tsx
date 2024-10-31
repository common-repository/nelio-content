/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useDrop } from 'react-dnd';
import {
	useItemDropper,
	useDayType,
	useMinRowHeight,
} from '@nelio-content/calendar';

import type { DraggableItemSummary } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { Actions } from './actions';
import { ItemList } from './item-list';

export type DayProps = {
	readonly day: string;
};

export const Day = ( { day }: DayProps ): JSX.Element => {
	const type = useDayType( day );
	const onDropItem = useItemDropper( day );
	const minHeight = useMinRowHeight();

	const [ { isHovered }, drop ] = useDrop<
		DraggableItemSummary,
		unknown,
		{ isHovered: boolean }
	>( {
		accept: [ 'post', 'social', 'task', 'reusable-message' ],
		drop: onDropItem,
		canDrop: ( { minDroppableDay } ) => minDroppableDay <= day,
		collect: ( monitor ) => ( {
			isHovered: monitor.canDrop() && monitor.isOver(),
		} ),
	} );

	const dayNumber = day.substring( 8 ).replace( /^0/, '' );

	return (
		<div
			className={ classnames( {
				'nelio-content-calendar-day': true,
				'nelio-content-calendar-day--is-hovered': isHovered,
			} ) }
			ref={ drop }
			style={ { minHeight } }
		>
			<div className="nelio-content-calendar-day__header">
				<div
					className={ `nelio-content-calendar-day__label nelio-content-calendar-day__label--${ type }` }
				>
					{ dayNumber }
				</div>

				{ 'past-day' !== type && <Actions day={ day } /> }
			</div>

			<ItemList day={ day } />
		</div>
	);
};
