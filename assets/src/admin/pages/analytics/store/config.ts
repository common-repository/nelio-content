/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	sortBy: 'pageviews',
	filters: {
		author: undefined,
		period: {
			mode: 'all-time',
			value: {
				from: '',
				to: '',
			},
		},
		postType: undefined,
	},
	status: {
		loading: [],
		pagination: {},
	},
	postsByCriteria: {},
};
