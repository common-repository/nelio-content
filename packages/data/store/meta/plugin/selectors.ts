/**
 * External dependencies
 */
import { indexOf } from 'lodash';
import { make } from 'ts-brand';
import type {
	OrderedSubscriptionPlans,
	PremiumFeature,
	SubscriptionPlan,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getPluginLimits(
	state: State
): State[ 'meta' ][ 'plugin' ][ 'limits' ] {
	return state.meta.plugin.limits;
} //end getPluginLimits()

export function getPremiumStatus(
	state: State
): State[ 'meta' ][ 'plugin' ][ 'premiumStatus' ] {
	return state.meta.plugin.premiumStatus;
} //end getPremiumStatus()

export function isSubscribed(
	state: State,
	requiredPlan?: SubscriptionPlan
): boolean {
	const { subscriptionPlan } = state.meta.plugin;
	if ( ! requiredPlan ) {
		return 'none' !== subscriptionPlan;
	} //end if
	const plans: OrderedSubscriptionPlans = [ 'basic', 'standard', 'plus' ];
	return indexOf( plans, requiredPlan ) <= indexOf( plans, subscriptionPlan );
} //end isSubscribed()

export function isFeatureEnabled( state: State, _: PremiumFeature ): boolean {
	return isSubscribed( state );
} //end isFeatureEnabled()

export function hasPromoActive( state: State, promo: string ): boolean {
	return state.meta.plugin.activePromos.includes( promo );
} //end hasPromoActive()

export function isAnalyticsEnabled( state: State ): boolean {
	return state.meta.plugin.isAnalyticsEnabled;
} //end isAnalyticsEnabled()

export function isGAConnected( state: State ): boolean {
	return state.meta.plugin.isGAConnected;
} //end isGAConnected()

export function getApiRoot( state: State ): string {
	return state.meta.plugin.apiRoot;
} //end getApiRoot()

export function getAuthenticationToken( state: State ): string {
	return state.meta.plugin.authenticationToken;
} //end getAuthenticationToken()

export function areAutoTutorialsEnabled( state: State ): boolean {
	return state.meta.plugin.areAutoTutorialsEnabled;
} //end areAutoTutorialsEnabled()

export function getDefaultTime(
	state: State,
	type: 'post' | 'social'
): string {
	return state.meta.plugin.defaultTimes[ type ];
} //end getDefaultTime()

export function getNonReferenceDomainRegexes(
	state: State
): ReadonlyArray< RegExp > {
	return state.meta.plugin.nonReferenceDomainRegexes ?? [];
} //end getNonReferenceDomainRegexes()

export function isSocialPublicationPaused( state: State ): boolean {
	return !! state.meta.plugin.isSocialPublicationPaused;
} //end isSocialPublicationPaused()

export function isSocialPublicationStatusBeingSynched( state: State ): boolean {
	return !! state.meta.plugin.isSocialPublicationStatusBeingSynched;
} //end isSocialPublicationStatusBeingSynched()

export function getPremiumDialog( state: State ): 'none' | PremiumFeature {
	return state.meta.plugin.premiumDialog;
} //end getPremiumDialog()

export function getPluginUrl( state: State, path: string = '' ): Url {
	return make< Url >()( `${ state.meta.plugin.pluginUrl }${ path }` );
} //end getPluginUrl()
