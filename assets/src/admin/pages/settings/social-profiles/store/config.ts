/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	connection: {
		connectionDialog: undefined,
		kindDialog: undefined,
	},

	profileEditor: {
		profileId: undefined,
		isSaving: false,
		settings: {
			email: '',
			permalinkQueryArgs: [],
		},
	},

	profileList: {
		deleting: [],
		refreshing: [],
		isRefreshing: false,
	},
};
