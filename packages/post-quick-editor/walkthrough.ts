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
		title: _x( 'Post Editor', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the post editor. This simple modal lets you quickly and efficiently create new posts or edit existing ones.',
			'user',
			'nelio-content'
		),
	},
	{
		title: _x( 'Title', 'text', 'nelio-content' ),
		intro: _x(
			'Here you can set or change the post’s title.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-post-quick-editor__title' ),
	},
	{
		title: _x( 'Post Type', 'text', 'nelio-content' ),
		intro: _x(
			'Use this selector to set its type to one of the post types enabled in Nelio Content’s advanced settings.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__type'
			),
		element: () =>
			document.querySelector( '.nelio-content-post-quick-editor__type' ),
	},
	{
		title: _x( 'Status', 'text', 'nelio-content' ),
		intro: _x(
			'Use this selector to set the post’s status.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__status'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-post-quick-editor__status'
			),
	},
	{
		title: _x( 'Status', 'text', 'nelio-content' ),
		intro: _x(
			'In multiauthor sites, you can select the author of any given post here.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__author'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-post-quick-editor__author'
			),
	},
	{
		title: _x( 'Date', 'text', 'nelio-content' ),
		intro: _x(
			'You can also set the date in which the post is supposed to be published. If you don’t set a specific date, the post will show up in the “Unscheduled” section.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__date'
			),
		element: () =>
			document.querySelector( '.nelio-content-post-quick-editor__date' ),
	},
	{
		title: _x( 'Time', 'text', 'nelio-content' ),
		intro: _x(
			'You can also set the publication time.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__time'
			),
		element: () =>
			document.querySelector( '.nelio-content-post-quick-editor__time' ),
	},
	{
		title: _x( 'More Options', 'text', 'nelio-content' ),
		intro: _x(
			'Finally, you can click on this link to show some additional settings. For example, if you’re creating or editing a blog post, this will reveal a couple of settings to tweak its categories and tags.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-post-quick-editor__extra-action'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-post-quick-editor__extra-action'
			),
	},
];
