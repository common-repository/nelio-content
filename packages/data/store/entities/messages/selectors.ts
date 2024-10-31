/**
 * External dependencies
 */
import { map, values } from 'lodash';
import { isDefined } from '@nelio-content/utils';
import type {
	Maybe,
	PostId,
	SocialMessage,
	SocialMessageSummary,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getSocialMessage(
	state: State,
	id?: Uuid
): Maybe< SocialMessage > {
	return id ? state.entities.messages.byId[ id ] : undefined;
} //end getSocialMessage()

export function getSocialMessagesRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< SocialMessage > {
	const summaries =
		!! postId && state.entities.messages.byRelatedPost[ postId ];
	if ( ! summaries ) {
		return [];
	} //end if

	const validMessages = filterOutInvalidAutoMessages(
		state,
		summaries || []
	);
	return map( validMessages, ( { id } ) =>
		getSocialMessage( state, id )
	).filter( isDefined );
} //end getSocialMessagesRelatedToPost()

export function getSocialMessageIdsRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< Uuid > {
	return map( getSocialMessagesRelatedToPost( state, postId ), 'id' );
} //end getSocialMessageIdsRelatedToPost()

export function getRecurringMessages(
	state: State,
	recurrenceGroup?: Uuid
): ReadonlyArray< SocialMessage > {
	return recurrenceGroup
		? values( state.entities.messages.byId ).filter(
				( m ) => m.recurrenceGroup === recurrenceGroup
		  )
		: [];
} //end getRecurringMessages()

// =======
// HELPERS
// =======

function filterOutInvalidAutoMessages(
	state: State,
	items: ReadonlyArray< SocialMessageSummary >
): ReadonlyArray< SocialMessageSummary > {
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
