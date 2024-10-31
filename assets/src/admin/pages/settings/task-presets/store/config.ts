/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	saving: false,
	taskPresets: {
		byId: {},
		allIds: [],
	},
	editor: undefined,
};
