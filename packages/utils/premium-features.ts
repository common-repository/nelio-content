/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

type ExtraFeature = {
	readonly name: string;
	readonly description: string;
};

export const PREMIUM_FEATURES: ReadonlyArray< ExtraFeature > = [
	{
		name: _x( 'Fresh Social Timelines.', 'text', 'nelio-content' ),
		description: _x(
			'Reach broader audiences on all your social channels.',
			'user',
			'nelio-content'
		),
	},
	{
		name: _x( 'Teams.', 'text', 'nelio-content' ),
		description: _x(
			'Organize your workflow and that of your team with editorial tasks and comments.',
			'user',
			'nelio-content'
		),
	},
	{
		name: _x( 'Advanced Automations.', 'text', 'nelio-content' ),
		description: _x(
			'Save time with Social Automations and let our plugin broadcast everything for you.',
			'user',
			'nelio-content'
		),
	},
	{
		name: _x( 'Outstanding Support.', 'text', 'nelio-content' ),
		description: _x(
			'Find all the help you need, when you need it.',
			'user',
			'nelio-content'
		),
	},
];
