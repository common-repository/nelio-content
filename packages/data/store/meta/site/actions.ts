/**
 * Internal dependencies
 */
import type { State as Settings } from './config';

export type SiteAction = InitSiteSettings | SetUtcNow;

export function initSiteSettings( settings: Settings ): InitSiteSettings {
	return {
		type: 'INIT_SITE_SETTINGS',
		settings,
	};
} //end initSiteSettings()

export function setUtcNow( now: string ): SetUtcNow {
	return {
		type: 'SET_UTC_NOW',
		now,
	};
} //end setUtcNow()

// ============
// HELPER TYPES
// ============

export type InitSiteSettings = {
	readonly type: 'INIT_SITE_SETTINGS';
	readonly settings: Settings;
};

type SetUtcNow = {
	readonly type: 'SET_UTC_NOW';
	readonly now: string;
};
