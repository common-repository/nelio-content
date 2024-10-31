/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isTimelineBusy( state: State ): boolean {
	return 'ready' !== state.social.timelineStatus;
} //end isTimelineBusy()

export function isGeneratingTimeline( state: State ): boolean {
	return 'generating' === state.social.timelineStatus;
} //end isGeneratingTimeline()

export function isClearingTimeline( state: State ): boolean {
	return 'clearing' === state.social.timelineStatus;
} //end isClearingTimeline()

export function isSocialMessageBeingDeleted(
	state: State,
	messageId: Uuid
): boolean {
	return state.social.deleting.includes( messageId );
} //end isSocialMessageBeingDeleted()

export function getDeletingMessageIds( state: State ): ReadonlyArray< Uuid > {
	return state.social.deleting;
} //end getDeletingMessageIds()

export function isRetrievingSocialMessages( state: State ): boolean {
	return !! state.social.isRetrievingSocialMessages;
} //end isRetrievingSocialMessages()
