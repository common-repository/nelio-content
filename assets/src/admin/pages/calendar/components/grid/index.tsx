/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import { DayGrid } from './day-grid';
import { AgendaGrid } from './agenda-grid';
import type { GridProps } from './props';

export const Grid = ( props: GridProps ): JSX.Element => {
	const calendarMode = useSelect( ( select ) =>
		select( NC_CALENDAR ).getCalendarMode()
	);

	return calendarMode === 'agenda' ? (
		<AgendaGrid { ...props } />
	) : (
		<DayGrid { ...props } />
	);
};
