/**
 * External dependencies
 */
import { make } from 'ts-brand';
import { AUTO_DRAFT, POST } from '@nelio-content/utils';
import type { AuthorId, PostId, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	comments: {
		synching: [],
		deleting: [],
		input: '',
		isRetrievingComments: false,
	},

	externalFeaturedImage: {
		view: 'no-image',
		fields: {
			url: '',
			alt: '',
		},
		imageUrl: undefined,
		imageAlt: '',
	},

	post: {
		id: make< PostId >()( 0 ),
		author: make< AuthorId >()( 0 ),
		authorName: '',
		content: '',
		customFields: {},
		customPlaceholders: {},
		date: '',
		editLink: make< Url >()( '' ),
		excerpt: '',
		followers: [],
		imageId: 0,
		imageSrc: false,
		images: [],
		isAutoShareEnabled: false,
		permalink: make< Url >()( '' ),
		permalinks: {},
		permalinkQueryArgs: [],
		permalinkTemplate: '',
		statistics: { engagement: {}, pageviews: undefined },
		status: AUTO_DRAFT,
		taxonomies: {},
		thumbnailSrc: false,
		title: '',
		type: POST,
		typeName: '',
		viewLink: make< Url >()( '' ),
		autoShareEndMode: 'never',
		automationSources: {
			useCustomSentences: false,
			customSentences: [],
		},
	},

	postQuality: {
		checks: {},
		isFullyIntegrated: false,
		settings: {
			allowedBads: 1,
			allowedImprovables: 2,
			unacceptableImprovables: 4,
		},
	},

	qualityCheckTypes: {},

	references: {
		byUrl: {},
		byType: {
			suggested: [],
		},
		status: {
			loading: [],
			saving: [],
		},
		editor: {
			isActive: false,
		},
		suggestedUrl: '',
	},

	settings: {
		isClassicEditor: false,
		isElementorEditor: false,
		panels: {},
		shouldAuthorBeFollower: false,
		autoShareEndModes: [],
	},

	social: {
		deleting: [],
		timelineStatus: 'ready',
		isRetrievingSocialMessages: false,
	},

	tasks: {
		preset: undefined,
		synching: [],
		deleting: [],
		isRetrievingTasks: false,
	},

	premiumByType: {},
};
