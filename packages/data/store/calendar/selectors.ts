/**
 * External dependencies
 */
import moment from 'moment';
import { date } from '@nelio-content/date';
import type {
	Item,
	ItemSummary,
	ItemType,
	Maybe,
	PostId,
	PostSummary,
	SocialMessageSummary,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { toCSV } from './csv';
import type { State } from '../config';

export function getItem(
	state: State,
	type: ItemType,
	itemId?: Item[ 'id' ]
): Maybe< Item > {
	if ( ! itemId ) {
		return undefined;
	} //end if
	switch ( type ) {
		case 'social':
			return state.entities.messages.byId[ itemId as Uuid ];
		case 'task':
			return state.entities.tasks.byId[ itemId as Uuid ];
		case 'external-event':
			return state.entities.externalEvents[ itemId as Uuid ];
		case 'internal-event':
			return state.entities.internalEvents[ itemId as Uuid ];
		case 'post':
			return state.entities.posts[ itemId as PostId ];
		default: {
			const items: Record< number | string, Item > =
				state.entities.premiumByType[ type ]?.byId ?? {};
			return items[ itemId ];
		} //end if
	} //end switch
} //end getItem()

export function getItemsInDay(
	state: State,
	localDay: string
): ReadonlyArray< ItemSummary > {
	return filterOutInvalidAutoMessages(
		state,
		state.calendar.days[ localDay ] || []
	);
} //end getItemsInDay()

export function getUnscheduledPosts(
	state: State
): ReadonlyArray< PostSummary > {
	return ( getItemsInDay( state, '0000-00-00' ) ||
		[] ) as ReadonlyArray< PostSummary >;
} //end getUnscheduledPosts()

export function getCSV(
	state: State,
	firstDay: string,
	lastDay: string
): string {
	let items: ReadonlyArray< ItemSummary > = [];

	const mday = moment( date( 'c', firstDay ) );
	let sday = date( 'Y-m-d', mday );
	while ( sday <= lastDay ) {
		items = [ ...items, ...getItemsInDay( state, sday ) ];
		mday.add( 1, 'day' );
		sday = date( 'Y-m-d', mday );
	} //end while

	return items.reduce(
		( acc, i ) =>
			acc + toCSV( state, i.type, getItem( state, i.type, i.id ) ),
		'"Date","Type","Author/Profile/Assignee","Title/Text/Task","Permalink","Status"\n'
	);
} //end getCSV()

// =======
// HELPERS
// =======

function filterOutInvalidAutoMessages(
	state: State,
	items: ReadonlyArray< ItemSummary >
) {
	return items.filter( ( sum ): sum is SocialMessageSummary => {
		if ( 'social' !== sum.type ) {
			return true;
		} //end if

		const item = state.entities.messages.byId[ sum.id ];
		if ( ! item ) {
			return false;
		} //end if

		const profile = state.social.profiles.byId[ item.profileId ];
		if ( ! profile ) {
			return false;
		} //end if

		if (
			'publication' === item.auto &&
			0 >= profile.publicationFrequency
		) {
			return false;
		} //end if

		if (
			[ 'timeline', 'reshare' ].includes( item.auto ?? '' ) &&
			0 >= profile.reshareFrequency
		) {
			return false;
		} //end if

		return true;
	} );
} //end filterOutInvalidAutoMessages()
