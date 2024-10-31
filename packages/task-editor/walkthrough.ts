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
		title: _x( 'Task Editor', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the task editor. Create and assign tasks to the authors of your blog and make sure you keep track of everything that matters.',
			'user',
			'nelio-content'
		),
	},
	{
		title: _x( 'Task Editor', 'text', 'nelio-content' ),
		intro: _x(
			'Tasks are actually quite simple. They consist of a description of the task itself, which you can type in here.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-task-editor__actual-task' ),
	},
	{
		title: _x( 'Assignee', 'text', 'nelio-content' ),
		intro: _x(
			'The assignee (that is, the person responsible of doing this task) can also be found and selected here.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector( '.nelio-content-task-editor__assignee' ),
		element: () =>
			document.querySelector( '.nelio-content-task-editor__assignee' ),
	},
	{
		title: _x( 'Due Date', 'text', 'nelio-content' ),
		intro: _x(
			'And the expected deadline can be set here.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector( '.nelio-content-task-editor__date-due' ),
		element: () =>
			document.querySelector( '.nelio-content-task-editor__date-due' ),
	},
	{
		title: _x( 'Task Colors', 'text', 'nelio-content' ),
		intro: _x(
			'Finally, you can optionally assign a color to the task to easily tell it appart from the others.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector( '.nelio-content-task-editor__colors' ),
		element: () =>
			document.querySelector( '.nelio-content-task-editor__colors' ),
	},
];
