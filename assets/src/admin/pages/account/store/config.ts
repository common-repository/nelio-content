/**
 * External dependencies
 */
import { make } from 'ts-brand';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	info: {
		plan: 'free',
		siteId: make< Uuid >()( '' ),
		limits: {
			maxAutomationGroups: 0,
			maxProfiles: 0,
			maxProfilesPerNetwork: 0,
		},
	},
	invoices: [],
	products: [],
	sites: [],
	meta: {
		dialog: undefined,
		editingLicense: '',
		lockReason: undefined,
		isAgencySummary: false,
	},
};
