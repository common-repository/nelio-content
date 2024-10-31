/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import moment from 'moment';
import { find } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { date } from '@nelio-content/date';
import { isEmpty } from '@nelio-content/utils';
import type {
	Dict,
	Maybe,
	Item,
	ItemSummary,
	PostId,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';
import type { Timeout } from '../types';

export function isCalendarSynching( state: State ): boolean {
	return ! isEmpty( state.status.updating );
} //end isCalendarSynching()

export function getLoaderTimeout( state: State ): Timeout {
	return state.status.loaderTimeout || 0;
} //end getLoaderTimeout()

export function isPeriodReady(
	state: State,
	firstDay: string,
	lastDay: string
): boolean {
	let day: string;
	const dayMoment = moment( firstDay );
	do {
		day = date( 'Y-m-d', dayMoment );
		if ( ! state.status.loadedDays[ day ] ) {
			return false;
		} //end if

		dayMoment.add( 1, 'day' );
	} while ( day <= lastDay );

	return true;
} //end isPeriodReady()

export function isSynching(
	state: State,
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): boolean {
	if ( 'post' === type ) {
		return !! find( state.status.updating, { relatedPost: id } );
	} //end if

	if ( !! find( state.status.updating, { type, id } ) ) {
		return true;
	} //end if

	const { getItem } = select( NC_DATA );
	const item = getItem( type, id );
	return (
		isRelatedPostUpdating( state, item ) ||
		isRecurrenceGroupUpdating( state, item )
	);
} //end isSynching()

// =======
// HELPERS
// =======

const isRelatedPostUpdating = ( state: State, item: Maybe< Item > ) =>
	hasPostId( item ) &&
	!! find( state.status.updating, {
		type: 'post',
		id: item.postId,
	} );

const hasPostId = ( x: unknown ): x is { postId: PostId } =>
	!! x && 'object' === typeof x && !! ( x as Dict ).postId;

const isRecurrenceGroupUpdating = ( state: State, item: Maybe< Item > ) =>
	hasRecurrenceGroup( item ) &&
	!! find( state.status.updating, {
		type: 'social',
		recurrenceGroup: item.recurrenceGroup,
	} );

const hasRecurrenceGroup = ( x: unknown ): x is { recurrenceGroup: Uuid } =>
	!! x && 'object' === typeof x && !! ( x as Dict ).recurrenceGroup;
