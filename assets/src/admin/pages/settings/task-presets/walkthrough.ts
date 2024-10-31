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
		title: _x( 'Settings - Task Presets', 'text', 'nelio-content' ),
		intro: _x(
			'Task presets make it possible to create editorial tasks once and use them when needed, thus saving a lot of time. Don’t repeat yourself and automate your workflow.',
			'text',
			'nelio-content'
		),
	},
	{
		title: _x( 'Task Presets', 'text', 'nelio-content' ),
		intro: _x(
			'You can easily create new task presets using this button.',
			'text',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-add-task-preset' ),
	},
	{
		title: _x( 'Task Presets', 'text', 'nelio-content' ),
		intro: _x(
			'Each preset has an identifying name and contains a set of tasks. Hover on each task to reveal its actions and, thus, be able to edit or delete it, or use the “New Task” button to create new tasks.',
			'text',
			'nelio-content'
		),
		elementToClick: (): HTMLElement | null => {
			const preset = document.querySelector(
				'.nelio-content-task-preset'
			);
			if ( ! preset ) {
				return null;
			} //end if
			if ( preset.querySelector( '.nelio-content-task-preset__body' ) ) {
				return null;
			} //end if
			return preset.querySelector(
				'.nelio-content-task-preset__header button'
			);
		},
		element: () => document.querySelector( '.nelio-content-task-preset' ),
		active: () => !! document.querySelector( '.nelio-content-task-preset' ),
	},
	{
		title: _x( 'Save Changes', 'text', 'nelio-content' ),
		intro: _x(
			'Once you’re happy with your setup, don’t forget to save your changes using this button!',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-save-button.is-primary' ),
	},
];
