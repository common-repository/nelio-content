/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	automationGroups: {
		byId: {
			universal: {
				id: 'universal',
				priority: 100,
				publication: { type: 'always' },
				profileSettings: {},
				networkSettings: {},
			},
		},
		allIds: [ 'universal' ],
	},
	validations: {
		universal: {
			areAuthorsValid: true,
			areTermsValid: {},
			isPostTypeValid: true,
			socialProfileErrors: {},
			templateErrors: {},
		},
	},
	frequencies: {},
	isSaving: false,
	templateEditor: {
		attributes: undefined,
		isNew: false,
		isNetwork: false,
		customFields: {},
		customPlaceholders: {},
		errors: {
			author: false,
			target: false,
			content: false,
			availability: false,
			taxonomies: {},
		},
	},
	templateImportExport: undefined,
};
