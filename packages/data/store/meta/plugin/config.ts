/**
 * External dependencies
 */
import type {
	PremiumFeature,
	SubscriptionPlan,
	Url,
} from '@nelio-content/types';

export type State = {
	readonly activePromos: ReadonlyArray< string >;
	readonly apiRoot: string;
	readonly areAutoTutorialsEnabled: boolean;
	readonly authenticationToken: string;
	readonly defaultTimes: {
		readonly post: string;
		readonly social: string;
	};
	readonly isAnalyticsEnabled: boolean;
	readonly isGAConnected: boolean;
	readonly isSocialPublicationPaused: boolean;
	readonly isSocialPublicationStatusBeingSynched: boolean;
	readonly limits: {
		readonly maxAutomationGroups: number;
		readonly maxProfiles: number;
		readonly maxProfilesPerNetwork: number;
	};
	readonly nonReferenceDomainRegexes: ReadonlyArray< RegExp >;
	readonly nonReferenceDomains: ReadonlyArray< string >;
	readonly pluginUrl: Url;
	readonly premiumStatus:
		| 'uninstalled'
		| 'inactive'
		| 'unsubscribed'
		| 'invalid-version'
		| 'ready';
	readonly subscriptionPlan: Extract< SubscriptionPlan, 'none' > extends never
		? SubscriptionPlan | 'none'
		: never;
	readonly premiumDialog: 'none' | PremiumFeature;
};

export const INIT: State = {
	activePromos: [],
	defaultTimes: {
		post: '10:00',
		social: '10:00',
	},
	isSocialPublicationPaused: false,
	isSocialPublicationStatusBeingSynched: false,
	apiRoot: '',
	areAutoTutorialsEnabled: true,
	authenticationToken: '',
	isAnalyticsEnabled: false,
	isGAConnected: false,
	pluginUrl: '' as Url,
	premiumStatus: 'uninstalled',
	premiumDialog: 'none',
	subscriptionPlan: 'none',
	limits: {
		maxAutomationGroups: 50,
		maxProfiles: 15,
		maxProfilesPerNetwork: 1,
	},
	nonReferenceDomainRegexes: [],
	nonReferenceDomains: [],
};
