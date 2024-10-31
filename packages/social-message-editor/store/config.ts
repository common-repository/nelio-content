/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	attributes: {
		profileIds: {
			all: [],
			byNetwork: {},
		},
		targetNamesByProfile: {},
		typeByNetwork: {
			bluesky: 'text',
			facebook: 'text',
			gmb: 'text',
			instagram: 'text',
			linkedin: 'text',
			mastodon: 'text',
			medium: 'text',
			pinterest: 'text',
			reddit: 'text',
			telegram: 'text',
			threads: 'text',
			tiktok: 'text',
			tumblr: 'text',
			twitter: 'text',
		},
		message: {
			dateType: 'predefined-offset',
			dateValue: '0',
			status: 'draft',
			text: '',
			timeType: 'predefined-offset',
			timeValue: '0',
		},
		reusableMessage: { active: false },
	},

	recurrence: {
		context: {
			monthday: 1,
			weekday: 'sun',
			weekindex: [ 1 ],
		},
		mode: 'toggeable',
		enabled: false,
		editing: false,
		settings: {
			occurrences: 2,
			interval: 1,
			period: 'day',
		},
	},

	status: {
		activeSocialNetwork: 'twitter',
		context: 'calendar',
		disabledProfileIds: [],
		error: '',
		isImageUrlSelectorVisible: false,
		isPreviewVisible: false,
		isSaving: false,
		isVisible: false,
		relatedPostStatus: { type: 'none' },
	},

	targetSelector: {
		selectedTargetNames: [],
	},
};
