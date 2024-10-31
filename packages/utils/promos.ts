/**
 * WordPress dependencies
 */
import { __, _x } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { format } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import { addDays } from './functions';

// NOTE. Dependency loop with @nelio-content/data.
import type { store } from '@nelio-content/data';
const NC_DATA = 'nelio-content/data' as unknown as typeof store;

type Promo = {
	readonly id: string;
	readonly predicate: ( today: string ) => boolean;
	readonly couponCode: string;
	readonly subscribeLabel: string;
	readonly unlockFeature?: string;
};

export function hasSubscriptionPromo( today: string ): boolean {
	return !! today && !! getPromo( today );
} //end hasSubscriptionPromo()

export function getSubscribeLabel( today: string ): string {
	const promo = getPromo( today );
	return (
		promo?.subscribeLabel ||
		_x( 'Upgrade to Premium', 'command', 'nelio-content' )
	);
} //end getSubscribeLabel()

export function getUnlockLabel( today: string ): string {
	const promo = getPromo( today );
	return (
		promo?.unlockFeature ||
		_x( 'Unlock with Nelio Content Premium', 'command', 'nelio-content' )
	);
} //end getUnlockLabel()

export function getSubscribeLink( today: string, utmContent: string ): string {
	const promo = getPromo( today );
	return addQueryArgs( 'https://neliosoftware.com/content/pricing/', {
		coupon: promo?.couponCode,
		utm_source: 'nelio-content',
		utm_medium: 'plugin',
		utm_campaign: 'free',
		utm_content: utmContent,
	} );
} //end getSubscribeLink()

// =========
//  HELPERS
// =========

const PROMOS: ReadonlyArray< Promo > = [
	{
		id: 'sixty-off',
		predicate: () => select( NC_DATA ).hasPromoActive( 'sixty-off' ),
		couponCode: 'NCYEARLY50OFF',
		subscribeLabel: _x( 'Save 60% on Premium!', 'user', 'nelio-content' ),
		unlockFeature: _x(
			'Unlock with Premium and Save 60%',
			'user',
			'nelio-content'
		),
	},
	{
		id: 'black-friday',
		predicate: ( today ) => {
			const currentYear = today.substring( 0, 4 );
			const thanksgiving = getThanksGivingDate( currentYear );
			const start = addDays( thanksgiving, -4 );
			const end = addDays( thanksgiving, 2 );
			return start <= today && today <= end;
		},
		couponCode: 'BLACKFRIDAYNELIO',
		subscribeLabel: _x( 'Black Friday Deal', 'command', 'nelio-content' ),
	},
	{
		id: 'cyber-monday',
		predicate: ( today ) => {
			const currentYear = today.substring( 0, 4 );
			const thanksgiving = getThanksGivingDate( currentYear );
			const cybermonday = addDays( thanksgiving, 3 );
			return cybermonday === today;
		},
		couponCode: 'BLACKFRIDAYNELIO',
		subscribeLabel: _x( 'Cyber Monday Deal', 'command', 'nelio-content' ),
	},
];

const getPromo = ( today = '' ) =>
	find( PROMOS, ( promo ) => promo.predicate( today ) );

const getThanksGivingDate = ( year: string ) => {
	const weekday = Number.parseInt( format( 'N', `${ year }-11-28` ) );
	const offset = weekday < 4 ? weekday + 3 : weekday - 4;
	return `${ year }-11-${ 28 - offset }`;
};
