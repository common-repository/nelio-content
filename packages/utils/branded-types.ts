/**
 * External dependencies
 */
import { make } from 'ts-brand';
import type {
	InternalEventType,
	PostStatusSlug,
	PostTypeName,
	TaxonomySlug,
	Url,
} from '@nelio-content/types';

const pt = make< PostTypeName >();
export const POST = pt( 'post' );
export const PAGE = pt( 'page' );

const pss = make< PostStatusSlug >();
export const AUTO_DRAFT = pss( 'auto-draft' );
export const DRAFT = pss( 'draft' );
export const PUBLISHED = pss( 'publish' );

const ts = make< TaxonomySlug >();
export const CAT = ts( 'category' );
export const TAG = ts( 'post_tag' );
export const PROD_CAT = ts( 'product_cat' );
export const PROD_TAG = ts( 'product_tag' );

const iet = make< InternalEventType >();
export const MAILPOET_NEWSLETTER = iet( 'mailpoet-newsletter' );
export const THE_EVENTS_CAL = iet( 'the-events-calendar' );
export const NELIO_AB_TESTING = iet( 'nelio-ab-testing' );

const URL_REGEX =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
export function isUrl( url?: string | Url ): url is Url {
	return !! url && URL_REGEX.test( url );
} //end isUrl()
