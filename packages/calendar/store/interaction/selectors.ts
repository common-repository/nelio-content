/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type {
	Dict,
	DraggableItemSummary,
	Maybe,
	ItemSummary,
	PostId,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';
import { isSynching } from '../status/selectors';

export function getHoverItem( state: State ): Maybe< ItemSummary > {
	return state.interaction.hover;
} //end getHoverItem()

export function isHighlighted(
	state: State,
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): boolean {
	const { hover } = state.interaction;
	if ( ! hover ) {
		return false;
	} //end if

	if ( 'external-event' === hover.type ) {
		return false;
	} //end if

	if ( 'internal-event' === hover.type ) {
		return false;
	} //end if

	if ( isSynching( state, type, id ) ) {
		return false;
	} //end if

	if ( hover.type === type && hover.id === id ) {
		return true;
	} //end if

	const { getItem } = select( NC_DATA );
	const item = getItem( type, id );
	if ( ! item ) {
		return false;
	} //end if

	if ( 'post' === type ) {
		return hover.relatedPostId === item.id;
	} //end if

	if ( hasPostId( item ) ) {
		if ( item.postId === hover.relatedPostId ) {
			return true;
		} //end if
	} //end if

	if ( hasRecurrenceGroup( item ) && hasRecurrenceGroup( hover ) ) {
		if ( item.recurrenceGroup === hover.recurrenceGroup ) {
			return true;
		} //end if
	} //end if

	return false;
} //end isHighlighted()

export function isDragging(
	state: State,
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): boolean {
	if ( ! state.interaction.drag ) {
		return false;
	} //end if

	return (
		state.interaction.drag.type === type && state.interaction.drag.id === id
	);
} //end isDragging()

export function getDraggingItem( state: State ): Maybe< DraggableItemSummary > {
	return state.interaction.drag;
} //end getDraggingItem()

// =======
// HELPERS
// =======

const hasPostId = ( x: unknown ): x is { postId: PostId } =>
	!! x && 'object' === typeof x && !! ( x as Dict ).postId;

const hasRecurrenceGroup = ( x: unknown ): x is { recurrenceGroup: Uuid } =>
	!! x && 'object' === typeof x && !! ( x as Dict ).recurrenceGroup;
