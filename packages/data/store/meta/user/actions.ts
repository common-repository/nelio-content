/**
 * Internal dependencies
 */
import type { State as Settings } from './config';

export type UserAction = InitUserSettings;

export function initUserSettings( settings: Settings ): InitUserSettings {
	return {
		type: 'INIT_USER_SETTINGS',
		settings,
	};
} //end initUserSettings()

// ============
// HELPER TYPES
// ============

type InitUserSettings = {
	readonly type: 'INIT_USER_SETTINGS';
	readonly settings: Settings;
};
