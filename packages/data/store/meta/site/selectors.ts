/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { filter, values } from 'lodash';
import { make } from 'ts-brand';
import { date } from '@nelio-content/date';
import { isDefined } from '@nelio-content/utils';
import type {
	Dict,
	Maybe,
	PostCapability,
	PostStatus,
	PostType,
	PostTypeContext,
	PostTypeName,
	Url,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { canCurrentUser } from '../user/selectors';
import type { State } from '../../config';

export function getActivePlugins( state: State ): ReadonlyArray< string > {
	return state.meta.site.activePlugins;
} //end getActivePlugins()

export function getToday( state: State ): string {
	return date( 'Y-m-d', state.meta.site.now );
} //end getToday()

export function getUtcNow( state: State ): string {
	return state.meta.site.now;
} //end getUtcNow()

export function getSiteId( state: State ): Uuid {
	return state.meta.site.id;
} //end getSiteId()

export function getHomeUrl( state: State ): Url {
	return state.meta.site.homeUrl;
} //end getHomeUrl()

export function getRestUrl( state: State, path = '/' ): Url {
	const url = state.meta.site.restUrl;
	return make< Url >()(
		url.includes( 'rest_route=' )
			? url.replace( 'rest_route=', `rest_route=${ path }` )
			: `${ url }${ path }`
	);
} //end getRestUrl()

export function getAdminUrl(
	state: State,
	path = '',
	args: Dict< string > = {}
): Url {
	const adminUrl = state.meta.site.adminUrl;
	return make< Url >()( addQueryArgs( adminUrl + path, args ) );
} //end getAdminUrl()

export function getFirstDayOfWeek( state: State ): number {
	return state.meta.site.firstDayOfWeek || 0;
} //end getFirstDayOfWeek()

export function isMultiAuthor( state: State ): boolean {
	return !! state.meta.site.isMultiAuthor;
} //end isMultiAuthor()

export function getPostTypes(
	state: State,
	context: PostTypeContext,
	capability: 'any' | PostCapability = 'any'
): ReadonlyArray< PostType > {
	const typeNames = state.meta.site.postTypesByContext[ context ];
	const types = typeNames
		.map( ( n ) => getPostType( state, n ) )
		.filter( isDefined );

	if ( 'any' === capability ) {
		return types;
	} //end if
	return filter( types, ( { name } ) =>
		canCurrentUser( state, capability, name )
	);
} //end getPostTypes()

export function getPostStatuses(
	state: State,
	postType?: PostTypeName
): ReadonlyArray< PostStatus > {
	if ( postType ) {
		return state.meta.site.postTypes[ postType ]?.statuses ?? [];
	} //end if

	return values( state.meta.site.postTypes )
		.map( ( pt ) => pt.statuses )
		.flatMap( ( statuses ) => statuses )
		.reduce(
			( r, ns ) =>
				r.every( ( es ) => es.slug !== ns.slug ) ? [ ...r, ns ] : r,
			[] as ReadonlyArray< PostStatus >
		);
} //end getPostStatuses()

export function getPostType(
	state: State,
	name: PostTypeName
): Maybe< PostType > {
	return state.meta.site.postTypes[ name ];
} //end getPostType()

export function getSiteTimezone( state: State ): string {
	return state.meta.site.timezone;
} //end getSiteTimezone()

export function getSiteLanguage( state: State ): string {
	return state.meta.site.language;
} //end getSiteLanguage()
