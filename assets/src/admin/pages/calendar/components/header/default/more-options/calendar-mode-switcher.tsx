/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { MenuGroup, MenuItemsChoice } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import type { CalendarMode } from '@nelio-content/calendar';

export const CalendarModeSwitcher = (): JSX.Element => {
	const calendarMode = useSelect( ( select ) =>
		select( NC_CALENDAR ).getCalendarMode()
	);
	const { setCalendarMode } = useDispatch( NC_CALENDAR );

	return (
		<MenuGroup label={ _x( 'View', 'text (name)', 'nelio-content' ) }>
			<MenuItemsChoice
				choices={ CALENDAR_MODES }
				value={ calendarMode }
				onSelect={ setCalendarMode }
			/>
		</MenuGroup>
	);
};

// ====
// DATA
// ====

const CALENDAR_MODES: ReadonlyArray< {
	readonly value: CalendarMode;
	readonly label: string;
} > = [
	{
		value: 'agenda',
		label: _x( 'Agenda', 'text', 'nelio-content' ),
	},
	{
		value: 'week',
		label: _x( 'One Week', 'text', 'nelio-content' ),
	},
	{
		value: 'two-weeks',
		label: _x( 'Two Weeks', 'text', 'nelio-content' ),
	},
	{
		value: 'month',
		label: _x( 'Month', 'text', 'nelio-content' ),
	},
];
