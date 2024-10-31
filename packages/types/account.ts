/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { FSProductId } from './fastspring';
import type { ArrayToUnion, MutableAndReadonlyArray, Url, Uuid } from './utils';

// =======
// ACCOUNT
// =======

export type Account = FreeAccount | AccountWithSubscription;

export type FreeAccount = {
	readonly plan: 'free';
	readonly siteId: Uuid;
	readonly limits: SiteLimits;
};

export type AccountWithSubscription = {
	readonly plan: SubscriptionPlan;
	readonly siteId: Uuid;
	readonly creationDate: string;
	readonly currency: string;
	readonly deactivationDate: string;
	readonly email: string;
	readonly endDate: string;
	readonly firstname: string;
	readonly isAgency: boolean;
	readonly lastname: string;
	readonly license: License;
	readonly limits: SiteLimits;
	readonly mode: 'regular' | 'invitation';
	readonly nextChargeDate: string;
	readonly nextChargeTotal: string;
	readonly period: 'year' | 'month';
	readonly photo: Url;
	readonly productId: FSProductId;
	readonly state: 'active' | 'canceled';
	readonly sitesAllowed: number;
	readonly subscription: SubscriptionId;
	readonly urlToManagePayments: Url;
};

// =====
// SITES
// =====

export type Site = {
	readonly id: Uuid;
	readonly actualUrl: Url;
	readonly isCurrentSite: boolean;
	readonly url: Url;
};

// ============
// HELPER TYPES
// ============

export type License = string;

export type SubscriptionId = Brand< string, 'SubscriptionId' >;

export type OrderedSubscriptionPlans = MutableAndReadonlyArray<
	[ 'basic', 'standard', 'plus' ]
>;

export type SubscriptionPlan = ArrayToUnion< OrderedSubscriptionPlans >;

export type SiteLimits = {
	readonly maxAutomationGroups: number;
	readonly maxProfiles: number;
	readonly maxProfilesPerNetwork: number;
};
