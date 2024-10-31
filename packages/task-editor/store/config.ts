/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	attributes: {
		task: '',
		dateType: 'predefined-offset',
		dateValue: '0',
		color: 'none',
		completed: false,
	},

	status: {
		context: 'calendar',
		error: '',
		isNewTask: false,
		isSaving: false,
		isVisible: false,
		relatedPost: {
			post: undefined,
			status: 'none',
		},
		source: {
			color: 'none',
			completed: false,
			dateType: 'predefined-offset',
			dateValue: '0',
			task: '',
		},
		onSave: undefined,
	},
};
