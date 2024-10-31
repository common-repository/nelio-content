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
		title: _x( 'Social Message Editor', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the social message editor. Use it to create and schedule social messages that will be automatically shared by Nelio Content when the right time comes.',
			'user',
			'nelio-content'
		),
	},

	// MULTIPLE PROFILE SELECTION
	{
		title: _x( 'Profile Selector', 'text', 'nelio-content' ),
		intro: _x(
			'This is your profile selector, where you can select the profiles in which your social message will be shared. Please notice you can schedule the same social message on multiple accounts at once.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-multiple-profile-selector'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-multiple-profile-selector'
			),
	},
	{
		title: _x( 'Profile Selector', 'text', 'nelio-content' ),
		intro: _x(
			'Click on the accounts you’re interested in to toggle their selection. When a profile is selected, it’ll be properly highlighted.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-multiple-profile-selector'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-multiple-profile-selector__profile-input-field'
			),
	},
	{
		title: _x( 'Profile Selector', 'text', 'nelio-content' ),
		intro: _x(
			'If you want to select profiles from a different network, switch to the desired network here. Nelio Content will keep track of the social profiles you’ve already selected, which means the same message can be shared on different profiles from different networks.',
			'user',
			'nelio-content'
		),
		active: () =>
			1 <
			document.querySelectorAll(
				'.nelio-content-multiple-profile-selector .nelio-content-multiple-profile-selector__network'
			).length,
		element: () =>
			document.querySelectorAll< HTMLElement >(
				'.nelio-content-multiple-profile-selector .nelio-content-multiple-profile-selector__network'
			)[ 1 ] || null,
	},

	// SINGLE PROFILE SWITCHER
	{
		title: _x( 'Profile Selector', 'text', 'nelio-content' ),
		intro: _x(
			'When editing an existing social message, use this selector to change the social account in which it should be shared.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-single-profile-selector'
			),
		element: () =>
			document.querySelector( '.nelio-content-single-profile-selector' ),
	},

	// MESSAGE AND OTHER STUFF
	{
		title: _x( 'Social Message', 'text', 'nelio-content' ),
		intro: _x(
			'Use this text area to write and customize your social message. You can write hashtags and X mentions.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector(
				'.nelio-content-social-message-editor__message-editor'
			),
	},
	{
		title: _x( 'Social Message', 'text', 'nelio-content' ),
		intro: _x(
			'Social networks usually impose certain limits on the maximum number of characters a message can have. This counter will let you know when you’re about to reach the limit.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-social-char-counter' ),
	},
	{
		title: _x( 'Quick Actions', 'text', 'nelio-content' ),
		intro: _x(
			'The icons before the character counter are quick actions you can use to tweak your message and/or preview it. Hover over each action to reveal its purpose. Also, if you want to share the social message with an image, you can do so using the “Add Image” action.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-social-message-editor__quick-actions'
			),
		element: () =>
			document.querySelector(
				'.nelio-content-social-message-editor__quick-actions'
			),
	},

	// PREVIEW
	{
		title: _x( 'Message Preview', 'text', 'nelio-content' ),
		intro: _x(
			'Use this action to enable the message preview, which will show you an approximation of the look and feel the message will have when it’s finally published on the selected social media accounts.',
			'user',
			'nelio-content'
		),
		active: () =>
			! document.querySelector( '.nelio-content-social-message-preview' ),
		element: () =>
			document.querySelector(
				'.nelio-content-social-message-editor__quick-action--is-preview'
			),
	},
	{
		title: _x( 'Message Preview', 'text', 'nelio-content' ),
		intro: _x(
			'This area shows an approximated preview of the look and feel the message will have when it’s finally published on the selected social media accounts.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-social-message-preview'
			),
		element: () =>
			document.querySelector( '.nelio-content-social-message-preview' ),
	},

	// SCHEDULE
	{
		title: _x( 'Schedule', 'text', 'nelio-content' ),
		intro: _x(
			'Finally, use these two settings to schedule the publication date and time of your social message.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector(
				'.nelio-content-social-message-editor__schedule-options'
			),
	},
];
