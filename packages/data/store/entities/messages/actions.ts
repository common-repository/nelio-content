/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Maybe, SocialMessage, Uuid } from '@nelio-content/types';

export type MessageAction =
	| RemoveSocialMessageAction
	| RemoveRecurringMessagesAction
	| ReceiveSocialMessagesAction;

export function receiveSocialMessages(
	messages: SocialMessage | ReadonlyArray< SocialMessage >
): ReceiveSocialMessagesAction {
	return {
		type: 'RECEIVE_SOCIAL_MESSAGES',
		messages: castArray( messages ),
	};
} //end receiveSocialMessages()

export function removeSocialMessage(
	messageId: Uuid
): RemoveSocialMessageAction {
	return {
		type: 'REMOVE_SOCIAL_MESSAGE',
		messageId,
	};
} //end removeSocialMessage()

export function removeRecurringMessages(
	recurrenceGroup: Maybe< Uuid >
): Maybe< RemoveRecurringMessagesAction > {
	return {
		type: 'REMOVE_RECURRING_MESSAGES',
		recurrenceGroup,
	};
} //end removeRecurringMessages()

// ============
// HELPER TYPES
// ============

type ReceiveSocialMessagesAction = {
	readonly type: 'RECEIVE_SOCIAL_MESSAGES';
	readonly messages: ReadonlyArray< SocialMessage >;
};

type RemoveSocialMessageAction = {
	readonly type: 'REMOVE_SOCIAL_MESSAGE';
	readonly messageId: Uuid;
};

type RemoveRecurringMessagesAction = {
	readonly type: 'REMOVE_RECURRING_MESSAGES';
	readonly recurrenceGroup: Maybe< Uuid >;
};
