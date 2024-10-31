/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useDrop } from 'react-dnd';
import type { DropTargetMonitor } from 'react-dnd';
import type { DraggableItemSummary } from '@nelio-content/types';

export type PeriodControlProps = {
	readonly children: string | JSX.Element;
	readonly interval: number;
	readonly onHover: () => void;
};

export const PeriodControl = ( {
	children,
	onHover,
	interval,
}: PeriodControlProps ): JSX.Element => {
	const run = useHoveringInterval( onHover, interval );

	const [ { isHovered }, drop ] = useDrop( {
		accept: [ 'post', 'social', 'task' ],
		hover: run,
		collect: ( monitor ) => ( {
			isHovered: monitor.canDrop() && monitor.isOver(),
		} ),
	} );

	return (
		<div
			className={ classnames( {
				'nelio-content-header__drop-control': true,
				'nelio-content-header__period-control': true,
				'nelio-content-header__period-control--is-hovered': isHovered,
			} ) }
			ref={ drop }
		>
			{ children }
		</div>
	);
};

// =====
// HOOKS
// =====

const useHoveringInterval = ( onHover: () => void, interval: number ) => {
	const [ isManaged, markAsManaged ] = useState( false );

	const runLater = ( monitor: DropTargetMonitor ) => {
		if ( ! monitor.isOver() ) {
			markAsManaged( false );
			return;
		} //end if
		onHover();
		setTimeout( () => runLater( monitor ), interval );
	};

	return ( _: DraggableItemSummary, monitor: DropTargetMonitor ) => {
		if ( isManaged ) {
			return;
		} //end if
		markAsManaged( true );
		setTimeout( () => runLater( monitor ), interval );
	};
};
