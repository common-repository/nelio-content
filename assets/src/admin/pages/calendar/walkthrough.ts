/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Walkthrough } from '@nelio-content/types';

export const walkthrough: Walkthrough = [
	{
		title: _x( 'Editorial Calendar', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to Nelio Content’s Editorial Calendar, an outstanding overview of all your WordPress and social media content.',
			'user',
			'nelio-content'
		),
	},
	{
		title: _x( 'Editorial Calendar', 'text', 'nelio-content' ),
		intro: _x(
			'The calendar shows all your posts, social messages, and editorial tasks. You can drag-and-drop any item in the calendar to reschedule it to a different day or click on them to open a quick editor modal.',
			'user',
			'nelio-content'
		),
	},
	{
		title: _x( 'Add Items', 'text', 'nelio-content' ),
		intro: _x(
			'Use this button to add new posts, social messages, or tasks in the calendar. You can also hover over any (non-past) day in the calendar to reveal the same set of actions to create items for that specific day.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-item-creation-button' ),
	},
	{
		title: _x( 'Filters', 'text', 'nelio-content' ),
		intro: _x(
			'Use this option to open the filter panel and select which elements should be visible in the calendar. When there are active filters, the color of this button will be different.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector(
				'.nelio-content-header__toolbar-button--is-filter'
			),
	},
	{
		title: _x( 'Unscheduled Items', 'text', 'nelio-content' ),
		intro: _x(
			'This button toggles the “Unscheduled” posts panel. When enabled, you’ll be able to drag-and-drop items from and to the “Unscheduled” area to (un)schedule them.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector(
				'.nelio-content-header__toolbar-button--is-unscheduled'
			),
	},
	{
		title: _x( 'More Options', 'text', 'nelio-content' ),
		intro: _x(
			'Under this menu, you’ll find some additional options like, for example, changing the calendar view, pausing the publication of any scheduled messages on your social media, exporting the calendar to CSV, or clearing all your active filters.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector(
				'.nelio-content-header__toolbar-button--is-more'
			),
	},
];
