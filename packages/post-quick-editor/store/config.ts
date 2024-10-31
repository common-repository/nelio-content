/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	attributes: {
		// BASIC.
		title: '',
		type: undefined,
		taxonomies: {},
		authorId: undefined,
		status: undefined,
		dateValue: '',
		timeValue: '',

		// EDITOR.
		referenceInput: '',
		references: [],
		tasks: [],
		newComments: [],

		premiumItemsByType: {},
	},

	status: {
		error: '',
		extraInfoTab: 'none',
		isPublished: false,
		isSaving: false,
		isVisible: false,
	},

	presetLoader: {
		isOpen: false,
		selection: [],
	},
};
