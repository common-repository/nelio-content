/**
 * External dependencies
 */
import { castArray, trim } from 'lodash';
import type {
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { ReusableMessageQueryStatus } from './config';

export type ReusableMessageAction =
	| RemoveReusableMessage
	| ReceiveReusableMessages
	| MarkReusableMessagesAsFullyLoaded
	| SetReusableMessageQuery
	| SetReusableMessageQueryStatus;

export function receiveReusableMessages(
	messages: ReusableSocialMessage | ReadonlyArray< ReusableSocialMessage >
): ReceiveReusableMessages {
	return {
		type: 'RECEIVE_REUSABLE_MESSAGES',
		messages: castArray( messages ),
	};
} //end receiveReusableMessages()

export function removeReusableMessage(
	messageId: ReusableSocialMessageId
): RemoveReusableMessage {
	return {
		type: 'REMOVE_REUSABLE_MESSAGE',
		messageId,
	};
} //end removeReusableMessage()

export function markReusableMessagesAsFullyLoaded(): MarkReusableMessagesAsFullyLoaded {
	return {
		type: 'MARK_REUSABLE_MESSAGES_AS_FULLY_LOADED',
	};
} //end markReusableMessagesAsFullyLoaded()

export function setReusableMessageQuery(
	query: string
): SetReusableMessageQuery {
	return {
		type: 'SET_REUSABLE_MESSAGE_QUERY',
		query,
	};
} //end setReusableMessageQuery()

export function setReusableMessageQueryStatus(
	query: string,
	status: ReusableMessageQueryStatus
): SetReusableMessageQueryStatus {
	return {
		type: 'SET_REUSABLE_MESSAGE_QUERY_STATUS',
		query: trim( query ),
		status,
	};
} //end setReusableMessageQueryStatus()

// ============
// HELPER TYPES
// ============

type RemoveReusableMessage = {
	readonly type: 'REMOVE_REUSABLE_MESSAGE';
	readonly messageId: ReusableSocialMessageId;
};

type ReceiveReusableMessages = {
	readonly type: 'RECEIVE_REUSABLE_MESSAGES';
	readonly messages: ReadonlyArray< ReusableSocialMessage >;
};

type MarkReusableMessagesAsFullyLoaded = {
	readonly type: 'MARK_REUSABLE_MESSAGES_AS_FULLY_LOADED';
};

type SetReusableMessageQuery = {
	readonly type: 'SET_REUSABLE_MESSAGE_QUERY';
	readonly query: string;
};

type SetReusableMessageQueryStatus = {
	readonly type: 'SET_REUSABLE_MESSAGE_QUERY_STATUS';
	readonly query: string;
	readonly status: ReusableMessageQueryStatus;
};
