/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import type { DraggableItemSummary } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { PeriodControl } from './period-control';
import { Trash } from './trash';
import { PeriodLabel } from '../period-label';

const HOVER_INTERVAL = 1000;

export type DraggingHeaderProps = {
	readonly type: DraggableItemSummary[ 'type' ];
};

export const DraggingHeader = ( {
	type,
}: DraggingHeaderProps ): JSX.Element => {
	const isCalendarSynching = useSelect( ( select ) =>
		select( NC_CALENDAR ).isCalendarSynching()
	);

	const navigation = useNavigationControls();

	return (
		<div className="nelio-content-header__dragging-controls">
			<div className="nelio-content-header__period-controller">
				<PeriodControl
					onHover={ navigation.prev }
					interval={ HOVER_INTERVAL }
				>
					{ _x( 'Previous', 'command', 'nelio-content' ) }
				</PeriodControl>
				<PeriodControl
					onHover={ navigation.next }
					interval={ HOVER_INTERVAL }
				>
					{ _x( 'Next', 'command', 'nelio-content' ) }
				</PeriodControl>

				<PeriodLabel isBlurred={ true } />

				{ isCalendarSynching && <Spinner /> }
			</div>

			<Trash>
				{ 'post' === type
					? _x( 'Trash', 'command', 'nelio-content' )
					: _x( 'Delete', 'command', 'nelio-content' ) }
			</Trash>
		</div>
	);
};

// =====
// HOOKS
// =====

const useNavigationControls = () => {
	const { previousPeriod, nextPeriod } = useDispatch( NC_CALENDAR );
	return {
		prev: () => previousPeriod( HOVER_INTERVAL + 200 ),
		next: () => nextPeriod( HOVER_INTERVAL + 200 ),
	};
};
