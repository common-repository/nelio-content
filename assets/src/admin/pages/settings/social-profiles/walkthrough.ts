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
		title: _x( 'Settings - Social Profiles', 'text', 'nelio-content' ),
		intro: _x(
			'Welcome to the Social Profiles Settings Screen. Here you can manage the social accounts you connected to Nelio Content and customize its auto-publication limits.',
			'user',
			'nelio-content'
		),
	},
	{
		title: _x( 'Available Networks', 'text', 'nelio-content' ),
		intro: _x(
			'To connect new profiles, click on its social network and follow the on-screen instructions.',
			'user',
			'nelio-content'
		),
		element: () =>
			document.querySelector( '.nelio-content-profile-connectors' ),
	},

	// SOCIAL PROFILES
	{
		title: _x( 'Social Profiles', 'text', 'nelio-content' ),
		intro: _x(
			'Here you can find all your connected profiles. Hover on each profile to reveal additional actions like, for example, re-authenticating or deleting a profile.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-profile-list .nelio-content-profile'
			),
		element: () => document.querySelector( '.nelio-content-profile-list' ),
	},

	{
		title: _x( 'Social Profiles', 'text', 'nelio-content' ),
		intro: _x(
			'You can also add a fallback email address for each profile. Nelio Content will use it to let the recipient know when a social message couldn’t be automatically shared, thus offering them the opportunity to manually share it.',
			'user',
			'nelio-content'
		),
		active: () =>
			!! document.querySelector(
				'.nelio-content-profile-list .nelio-content-profile'
			),
		element: () => document.querySelector( '.nelio-content-profile-list' ),
	},

	// GO TO AUTOMATIONS
	{
		title: _x( 'Social Automations', 'text', 'nelio-content' ),
		intro: _x(
			'In the Automations tab you’ll find all the options you need to customize how Nelio Content should share your WordPress content on social media, including how many social messages should be generated to do so.',
			'user',
			'nelio-content'
		),
		active: () => !! document.querySelector( '#nelio-content-automations' ),
		element: () => document.querySelector( '#nelio-content-automations' ),
	},
];
