/**
 * External dependencies
 */
import { filter, map } from 'lodash';
import type { Maybe, PremiumFeature } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State as Settings } from './config';

export type PluginAction =
	| InitPluginSettings
	| MarkSocialPublicationAsPaused
	| MarkSocialPublicationStatusAsBeingSynched
	| ReceiveAuthenticationToken
	| SetDefaultTime
	| OpenPremiumDialog
	| ClosePremiumDialog;

export function initPluginSettings( settings: Settings ): InitPluginSettings {
	return {
		type: 'INIT_PLUGIN_SETTINGS',
		settings: fixSettings( settings ),
	};
} //end initPluginSettings()

export function receiveAuthenticationToken(
	token: string
): ReceiveAuthenticationToken {
	return {
		type: 'RECEIVE_AUTHENTICATION_TOKEN',
		token,
	};
} //end receiveAuthenticationToken()

export function markSocialPublicationAsPaused(
	isPaused: boolean
): MarkSocialPublicationAsPaused {
	return {
		type: 'MARK_SOCIAL_PUBLICATION_STATUS_AS_PAUSED',
		isPaused,
	};
} //end markSocialPublicationAsPaused()

export function markSocialPublicationStatusAsBeingSynched(
	isBeingSynched: boolean
): MarkSocialPublicationStatusAsBeingSynched {
	return {
		type: 'MARK_SOCIAL_PUBLICATION_STATUS_AS_BEING_SYNCHED',
		isBeingSynched,
	};
} //end markSocialPublicationStatusAsBeingSynched()

export function setDefaultTime(
	context: 'post' | 'social',
	time: string
): SetDefaultTime {
	time = /^([01][0-9]|2[0123]):[0-5][0-9]$/.test( time ) ? time : '10:00';
	return {
		type: 'SET_DEFAULT_TIME',
		context,
		time,
	};
} //end setDefaultTime()

export function openPremiumDialog(
	feature: PremiumFeature
): OpenPremiumDialog {
	return {
		type: 'OPEN_PREMIUM_DIALOG',
		feature,
	};
} //end openPremiumDialog()

export function closePremiumDialog(): ClosePremiumDialog {
	return {
		type: 'CLOSE_PREMIUM_DIALOG',
	};
} //end closePremiumDialog()

// ============
// HELPER TYPES
// ============

type InitPluginSettings = {
	readonly type: 'INIT_PLUGIN_SETTINGS';
	readonly settings: Settings;
};

type ReceiveAuthenticationToken = {
	readonly type: 'RECEIVE_AUTHENTICATION_TOKEN';
	readonly token: string;
};

type SetDefaultTime = {
	readonly type: 'SET_DEFAULT_TIME';
	readonly context: 'post' | 'social';
	readonly time: string;
};

type MarkSocialPublicationAsPaused = {
	readonly type: 'MARK_SOCIAL_PUBLICATION_STATUS_AS_PAUSED';
	readonly isPaused: boolean;
};

type MarkSocialPublicationStatusAsBeingSynched = {
	readonly type: 'MARK_SOCIAL_PUBLICATION_STATUS_AS_BEING_SYNCHED';
	readonly isBeingSynched: boolean;
};

type OpenPremiumDialog = {
	readonly type: 'OPEN_PREMIUM_DIALOG';
	readonly feature: PremiumFeature;
};

type ClosePremiumDialog = {
	readonly type: 'CLOSE_PREMIUM_DIALOG';
};

// =======
// HELPERS
// =======

function fixSettings( settings: Settings ): Settings {
	const { limits, nonReferenceDomains } = settings;
	const { maxProfiles, maxProfilesPerNetwork } = limits;
	return {
		...settings,
		limits: {
			maxAutomationGroups: limits.maxAutomationGroups,
			maxProfiles: infinitize( maxProfiles ),
			maxProfilesPerNetwork: infinitize( maxProfilesPerNetwork ),
		},
		nonReferenceDomainRegexes: filter(
			map( nonReferenceDomains, createDomainRegex ),
			isRegExp
		),
	};
} //end fixSettings()

function createDomainRegex( domain: string ): Maybe< RegExp > {
	domain = domain.replace( /\./g, '\\.' );
	domain = domain.replace( /\*$/, '[^/]+' );
	domain = domain.replace( /\*/g, '[^/]*' );
	try {
		return new RegExp( '^[^:]+://[^/]*' + domain );
	} catch ( _ ) {
		return undefined;
	} //end catch
} //end createDomainRegex()

function infinitize( value: number ) {
	return -1 === value ? Number.POSITIVE_INFINITY : value;
} //end infinitize()

function isRegExp( re?: RegExp ): re is RegExp {
	return !! re;
} //end isRegExp()
