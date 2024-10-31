/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter, flatten, keys, map, values } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { isPremiumItemVisible } from '@nelio-content/premium-hooks-for-pages';
import { isEmpty } from '@nelio-content/utils';
import type {
	AuthorId,
	EditorialTask,
	ExternalEvent,
	InternalEvent,
	InternalEventType,
	Item,
	ItemSummary,
	Maybe,
	Post,
	PostTypeName,
	PremiumCalendarFilters,
	PremiumItem,
	SocialMessage,
	SocialNetworkName,
	Url,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { FilterPaneTab } from './config';
import type { State } from '../config';

export function getFilters( state: State ): State[ 'filters' ] {
	return state.filters;
} //end getFilters()

export function getActiveTabInFilterPane( state: State ): FilterPaneTab {
	return state.filters.activeTab;
} //end getActiveTabInFilterPane()

export function areThereActiveFilters( state: State ): boolean {
	return (
		areThereActivePostFilters( state ) ||
		areThereActiveSocialFilters( state ) ||
		areThereActiveTaskFilters( state ) ||
		areThereActiveExternalEventFilters( state )
	);
} //end areThereActiveFilters()

export function areThereActivePostFilters( state: State ): boolean {
	return (
		! isEmpty( getDisabledPostTypes( state ) ) ||
		! isEmpty( getDisabledStatuses( state ) ) ||
		! isEmpty( getPostAuthorFilter( state ) )
	);
} //end areThereActivePostFilters()

export function areThereActiveSocialFilters( state: State ): boolean {
	const profilesByNetwork = getDisabledSocialProfilesByNetwork( state );
	const profiles = flatten( values( profilesByNetwork ) );
	const { getSocialProfile } = select( NC_DATA );
	return ! isEmpty( filter( map( profiles, getSocialProfile ) ) );
} //end areThereActiveSocialFilters()

export function areThereActiveTaskFilters( state: State ): boolean {
	return ! areTasksVisible( state ) || !! getTaskAssigneeFilter( state );
} //end areThereActiveTaskFilters()

export function areThereActiveExternalEventFilters( state: State ): boolean {
	const urls = keys( state.externalCalendars.byUrl );
	const disabledUrls = getDisabledExternalCalendars( state );
	return !! disabledUrls.filter( ( url ) => urls.includes( url ) ).length;
} //end areThereActiveExternalEventFilters()

export function isItemVisible(
	state: State,
	type: ItemSummary[ 'type' ],
	item: Item
): boolean {
	switch ( type ) {
		case 'post':
			return isPost( item ) && isPostVisible( state, item );
		case 'social':
			return isSocial( item ) && isSocialVisible( state, item );
		case 'task':
			return isTask( item ) && isTaskVisible( state, item );
		case 'external-event':
			return isEvent( item ) && isExternalEventVisible( state, item );
		case 'internal-event':
			return (
				isInternalEvent( item ) && isInternalEventVisible( state, item )
			);

		default:
			return isPremiumItemVisible( type, item as PremiumItem );
	} //end switch
} //end isItemVisible()

export function getDisabledInternalEventTypes(
	state: State
): ReadonlyArray< InternalEventType > {
	return state.filters.disabledInternalEventTypes;
} //end getDisabledInternalEventTypes()

export function getDisabledExternalCalendars(
	state: State
): ReadonlyArray< Url > {
	return state.filters.disabledExternalCalendars;
} //end getDisabledExternalCalendars()

export function getDisabledPostTypes(
	state: State
): ReadonlyArray< PostTypeName > {
	return state.filters.disabledPostTypes;
} //end getDisabledPostTypes()

export function getDisabledStatuses( state: State ): ReadonlyArray< string > {
	return state.filters.disabledStatuses;
} //end getDisabledStatuses()

export function getDisabledSocialProfilesByNetwork(
	state: State
): Partial< Record< SocialNetworkName, ReadonlyArray< Uuid > > > {
	return state.filters.disabledSocialProfilesByNetwork;
} //end getDisabledSocialProfilesByNetwork()

export function getPostAuthorFilter( state: State ): Maybe< AuthorId > {
	return state.filters.postAuthor || undefined;
} //end getPostAuthorFilter()

export function areTasksVisible( state: State ): boolean {
	return state.filters.areTasksVisible;
} //end areTasksVisible()

export function getTaskAssigneeFilter( state: State ): Maybe< AuthorId > {
	return state.filters.taskAssignee || undefined;
} //end getTaskAssigneeFilter()

export function getPremiumFilter(
	state: State,
	filterName: keyof PremiumCalendarFilters
): Maybe< PremiumCalendarFilters[ keyof PremiumCalendarFilters ] > {
	if ( '_' === filterName ) {
		return undefined;
	} //end if
	return state.filters.premium[ filterName ];
} //end getPremiumFilter()

export function areSocialMessagesCollapsedInDay(
	state: State,
	day: string
): boolean {
	return ! state.filters.areAllMessagesVisibleInDay[ day ];
} //end areSocialMessagesCollapsedInDay()

export function areFailedMessagesVisible( state: State ): boolean {
	return state.filters.areFailedMessagesVisible;
} //end areFailedMessagesVisible()

export function areAutomaticMessagesVisible( state: State ): boolean {
	return state.filters.areAutomaticMessagesVisible;
} //end areAutomaticMessagesVisible()

// =======
// HELPERS
// =======

function isPostVisible( state: State, post: Post ): boolean {
	const authorFilter = getPostAuthorFilter( state );
	if ( authorFilter && authorFilter !== post.author ) {
		return false;
	} //end if

	// TODO. Filter by post taxonomies?

	const disabledTypes = getDisabledPostTypes( state );
	if ( disabledTypes.includes( post.type ) ) {
		return false;
	} //end if

	const disabledStatuses = getDisabledStatuses( state );
	if ( disabledStatuses.includes( post.status ) ) {
		return false;
	} //end if

	return true;
} //end isPostVisible()

function isSocialVisible( state: State, social: SocialMessage ): boolean {
	if ( 'error' === social.status && areFailedMessagesVisible( state ) ) {
		return true;
	} //end if

	if ( social.auto && ! areAutomaticMessagesVisible( state ) ) {
		return false;
	} //end if

	const disProfilesByNetwork = getDisabledSocialProfilesByNetwork( state );
	const disProfiles = disProfilesByNetwork[ social.network ] || [];
	return ! disProfiles.includes( social.profileId );
} //end isSocialVisible()

function isTaskVisible( state: State, task: EditorialTask ): boolean {
	if ( ! areTasksVisible( state ) ) {
		return false;
	} //end if

	const assigneeFilter = getTaskAssigneeFilter( state );
	if ( assigneeFilter && assigneeFilter !== task.assigneeId ) {
		return false;
	} //end if

	return true;
} //end isTaskVisible()

function isExternalEventVisible( state: State, event: ExternalEvent ): boolean {
	const disabledUrls = getDisabledExternalCalendars( state );
	return ! disabledUrls.includes( event.calendar );
} //end isExternalEventVisible()

function isInternalEventVisible( state: State, event: InternalEvent ): boolean {
	const disabledEventTypes = getDisabledInternalEventTypes( state );
	return ! disabledEventTypes.includes( event.type );
} //end isInternalEventVisible()

const isPost = ( i: Item ): i is Post => 'number' === typeof i.id;

const isSocial = ( i: Item ): i is SocialMessage =>
	! isPost( i ) && 'network' in i;

const isTask = ( i: Item ): i is EditorialTask => ! isPost( i ) && 'task' in i;

const isEvent = ( i: Item ): i is ExternalEvent =>
	! isPost( i ) && 'calendar' in i;

const isInternalEvent = ( i: Item ): i is InternalEvent => ! isPost( i );
