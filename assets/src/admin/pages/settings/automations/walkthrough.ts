/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Walkthrough } from '@nelio-content/types';

export const walkthrough: Walkthrough = [
	{
		title: _x( 'Settings - Social Automations', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the Social Automations Screen. Here you can customize which content from your site can be automatically shared by Nelio Content and where it should be shared.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
	},
	{
		title: _x( 'Automation Groups', 'text', 'nelio-content' ),
		intro: _x(
			'An Automation Group allows you to select some content from your WordPress site and customize where and how it should be shared.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child'
			),
	},
	{
		title: _x( 'Automation Groups', 'text', 'nelio-content' ),
		intro: _x(
			'In general, the first section of an automation group lets you filter your WordPress content by its type, taxonomies, author, and publication date.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group-settings__section'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
	},
	{
		title: _x( 'Automation Groups', 'text', 'nelio-content' ),
		intro: _x(
			'However, the Universal Group limits this selection to the publication date only.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group-settings__extra'
			),
	},
	{
		title: _x( 'Automation Groups', 'text', 'nelio-content' ),
		intro: _x(
			'Once you’ve established which content is shareable, you can select the social profiles where Nelio Content is allowed to share it.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group-settings__section + .nelio-content-automation-group-settings__section'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
	},
	{
		title: _x( 'Automation Groups', 'text', 'nelio-content' ),
		intro: _x(
			'Click on each social profile to toggle it. If it’s selected, Nelio Content might use it to share content on your behalf.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group-settings__section + .nelio-content-automation-group-settings__section'
			),
	},
	{
		title: _x( 'Social Profile Settings', 'text', 'nelio-content' ),
		intro: _x(
			'Active social profiles will show up here. Click on any profile to further customize how Nelio Content should use it to share your content.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar'
			),
	},
	{
		title: _x( 'Social Profile Settings', 'text', 'nelio-content' ),
		intro: sprintf(
			/* translators: 1 -> a dashicon, 2 -> another dashicon */
			_x(
				'In particular, you can customize if and how Nelio Content should share content on publication (%1$s) and on reshare (%2$s).',
				'user',
				'nelio-content'
			),
			'<span class="dashicons dashicons-megaphone"></span>',
			'<span class="dashicons dashicons-share-alt"></span>'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-profile-settings__tab-selector'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar'
			),
	},
	{
		title: _x( 'Social Profile Settings', 'text', 'nelio-content' ),
		intro: _x(
			'If you enable social automations for a profile, you’ll be able to specify how many social messages should be created by Nelio Content when sharing new content, as well as the Social Templates is should use to do so, thus setting the tone of your auto-publications. Please notice the number of messages you set in one automation group is actually shared across all your groups.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-templates'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-profile-settings'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-profile-settings'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			) ||
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar'
			),
	},
	{
		title: _x( 'Duplicate and Delete', 'text', 'nelio-content' ),
		intro: _x(
			'You can easily duplicate an existing group or delete it using the actions here.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-actions'
			),
	},
	{
		title: _x( 'Temporary Deactivation', 'text', 'nelio-content' ),
		intro: _x(
			'If you want to disable a set of posts from being auto-shared, you can easily do so by toggling this button in the desired automation group.',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item:not(:first-child)'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__header-content-activation-toggle'
			),
	},
	{
		title: _x( 'Save Changes', 'text', 'nelio-content' ),
		intro: _x(
			'Once you’re happy with your setup, don’t forget to save your changes using this button!',
			'user',
			'nelio-content'
		),
		elementToClick: () =>
			document.querySelector(
				'.nelio-content-automation-group:first-child .nelio-content-automation-group__sidebar-item'
			),
		element: () =>
			document.querySelector( '.nelio-content-save-automation-groups' ),
	},
];
