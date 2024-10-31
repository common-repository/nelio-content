/**
 * External dependencies
 */
import {
	filter,
	groupBy,
	map,
	mapValues,
	negate as not,
	pick,
	some,
	sortBy,
	values,
} from 'lodash';
import {
	createItemSummary,
	createPremiumItemSummary,
	hasHead,
	isDefined,
} from '@nelio-content/utils';
import type { AnyAction, ItemSummary, Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';

import type { State } from './config';

import type { InitSiteSettings } from '../meta/site/actions';
import type { ExternalEventAction } from '../entities/external-events/actions';
import type { InternalEventAction } from '../entities/internal-events/actions';
import type { MessageAction } from '../entities/messages/actions';
import type { PostAction } from '../entities/posts/actions';
import type { TaskAction } from '../entities/tasks/actions';
import type { PremiumItemAction } from '../entities/premium/actions';

type Action =
	| InitSiteSettings
	| ExternalEventAction
	| InternalEventAction
	| MessageAction
	| PostAction
	| TaskAction
	| PremiumItemAction;

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'INIT_SITE_SETTINGS':
			return {
				...state,
				validPostTypes: {
					posts: action.settings.postTypesByContext.calendar,
					tasks: action.settings.postTypesByContext.tasks,
				},
			};

		case 'REMOVE_POST':
			return {
				...state,
				days: removeItem( state.days, 'post', action.postId ),
			};

		case 'REMOVE_TASK':
			return {
				...state,
				days: removeItem( state.days, 'task', action.taskId ),
			};

		case 'REMOVE_PREMIUM_ITEM':
			return {
				...state,
				days: removeItem( state.days, action.typeName, action.itemId ),
			};

		case 'REMOVE_SOCIAL_MESSAGE':
			return {
				...state,
				days: removeItem( state.days, 'social', action.messageId ),
			};

		case 'REMOVE_RECURRING_MESSAGES':
			return {
				...state,
				days: removeRecurringMessages(
					state.days,
					action.recurrenceGroup
				),
			};

		case 'REMOVE_EXTERNAL_EVENTS':
			return {
				...state,
				days: removeExternalEvents( state.days, action.ids ),
			};

		case 'RECEIVE_POSTS':
			return {
				...state,
				days: addItems(
					state.days,
					action.posts
						.filter( ( { type: pt } ) =>
							state.validPostTypes.posts.includes( pt )
						)
						.map( ( i ) => createItemSummary( 'post', i ) )
				),
			};

		case 'RECEIVE_TASKS':
			return {
				...state,
				days: addItems(
					state.days,
					action.tasks
						.filter(
							( { postType: pt } ) =>
								! pt ||
								state.validPostTypes.tasks.includes( pt )
						)
						.map( ( i ) => createItemSummary( 'task', i ) )
				),
			};

		case 'RECEIVE_PREMIUM_ITEMS':
			return {
				...state,
				days: addItems(
					state.days,
					action.items
						.map( ( i ) =>
							createPremiumItemSummary( action.typeName, i )
						)
						.filter( isDefined )
				),
			};

		case 'RECEIVE_SOCIAL_MESSAGES':
			return {
				...state,
				days: addItems(
					state.days,
					action.messages.map( ( i ) =>
						createItemSummary( 'social', i )
					)
				),
			};

		case 'RECEIVE_EXTERNAL_EVENTS':
			return {
				...state,
				days: addItems(
					state.days,
					action.events.map( ( i ) =>
						createItemSummary( 'external-event', i )
					)
				),
			};

		case 'RECEIVE_INTERNAL_EVENTS':
			return {
				...state,
				days: addItems(
					state.days,
					action.events.map( ( i ) =>
						createItemSummary( 'internal-event', i )
					)
				),
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function addItems(
	state: State[ 'days' ],
	items: ReadonlyArray< ItemSummary >
): State[ 'days' ] {
	if ( ! hasHead( items ) ) {
		return state;
	} //end if

	// Remove old items.
	state = items.reduce( ( s, i ) => removeItem( s, i.type, i.id ), state );

	// Add new items.
	const days = map( items, ( i ) => i.day );
	const existingItems = values( pick( state, days ) ).flatMap( ( i ) => i );
	state = {
		...state,
		...groupBy( [ ...items, ...existingItems ], 'day' ),
	};

	// Sort modified days.
	return mapValues( state, ( dayItems, day ) =>
		days.includes( day ) ? sortBy( dayItems, 'sort' ) : dayItems
	);
} //end addItems()

function removeItem(
	state: State[ 'days' ],
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): State[ 'days' ] {
	const isItem = ( i: ItemSummary ) => i.type === type && i.id === id;
	return mapValues( state, ( items ) =>
		some( items, isItem ) ? filter( items, not( isItem ) ) : items
	);
} //end removeItem()

function removeRecurringMessages(
	state: State[ 'days' ],
	group: Maybe< Uuid >
): State[ 'days' ] {
	if ( ! group ) {
		return state;
	} //end if

	const isInGroup = ( i: ItemSummary ) =>
		i.type === 'social' && i.recurrenceGroup === group;

	return mapValues( state, ( items ) =>
		some( items, isInGroup ) ? filter( items, not( isInGroup ) ) : items
	);
} //end removeRecurringMessages()

function removeExternalEvents(
	state: State[ 'days' ],
	ids: ReadonlyArray< Uuid >
): State[ 'days' ] {
	return mapValues( state, ( items ) =>
		items.filter(
			( i ) => i.type !== 'external-event' || ! ids.includes( i.id )
		)
	);
} //end removeExternalEvents()
