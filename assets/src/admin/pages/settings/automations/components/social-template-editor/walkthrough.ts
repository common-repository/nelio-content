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
		title: _x( 'Social Template Editor', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the social template editor, the easiest way to create custom templates for sharing your content on social media.',
			'user',
			'nelio-content'
		),
		elementToClick: () => null,
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog'
			),
	},
	{
		title: _x( 'Message', 'text', 'nelio-content' ),
		intro: _x(
			'Here you can write the template itself. Add placeholders like, for example, {title} or {tags}, which will be then replaced by Nelio Content when the template is used for sharing a specific post from your site.',
			'user',
			'nelio-content'
		),
		elementToClick: () => null,
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__text'
			),
	},
	{
		title: _x( 'Placeholders', 'text', 'nelio-content' ),
		intro: _x(
			'If you don’t know which placeholders are available, use this action and select the placeholder(s) you want to include in your template.',
			'user',
			'nelio-content'
		),
		elementToClick: () => null,
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__add-placeholder'
			),
	},
	{
		title: _x( 'Additional Filters', 'text', 'nelio-content' ),
		intro: _x(
			'By default, templates apply to all content in the Automation Group. But you can narrow the selection using these actions here.',
			'user',
			'nelio-content'
		),
		elementToClick: () => null,
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__quick-actions .is-link'
			) ||
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__tab-selector'
			),
	},
	{
		title: _x( 'Content Type', 'text', 'nelio-content' ),
		intro: _x(
			'Depending on the content selected in the Automation Group, you’ll be able to filter the tempate by taxonomy and/or author.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__quick-actions .is-link'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__tab-selector'
			),
	},
	{
		title: _x( 'Template Availability', 'text', 'nelio-content' ),
		intro: _x(
			'You can also customize the template’s availability (i.e. when a template is eligible). For instance, let Nelio Content use a template on post’s publication or on a Monday morning',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-social-template-editor__availability-action'
			),
		element: () =>
			document.querySelector( '.nelio-content-availability-control' ),
	},
	{
		title: _x( 'Save Changes', 'text', 'nelio-content' ),
		intro: _x(
			'Save the template using the “Save” button. If there are any errors, the button will be disabled – hover it to reveal the error.',
			'user',
			'nelio-content'
		),
		elementToClick: () => null,
		element: () =>
			document.querySelector(
				'.nelio-content-social-template-editor-dialog__save-button'
			),
	},
];
