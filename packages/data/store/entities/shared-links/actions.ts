/**
 * External dependencies
 */
import type { SharedLink, Url } from '@nelio-content/types';

export type SharedLinkAction =
	| MarkSharedLinkAsLoading
	| MarkSharedLinkAsError
	| ReceiveSharedLinkData;

export function markSharedLinkAsLoading( url: Url ): MarkSharedLinkAsLoading {
	return {
		type: 'MARK_SHARED_LINK_AS_LOADING',
		url,
	};
} //end markSharedLinkAsLoading()

export function markSharedLinkAsError( url: Url ): MarkSharedLinkAsError {
	return {
		type: 'MARK_SHARED_LINK_AS_ERROR',
		url,
	};
} //end markSharedLinkAsError()

export function receiveSharedLinkData(
	url: Url,
	data: SharedLink
): ReceiveSharedLinkData {
	return {
		type: 'RECEIVE_SHARED_LINK_DATA',
		url,
		data,
	};
} //end receiveSharedLinkData()

// ============
// HELPER TYPES
// ============

type MarkSharedLinkAsLoading = {
	readonly type: 'MARK_SHARED_LINK_AS_LOADING';
	readonly url: Url;
};

type MarkSharedLinkAsError = {
	readonly type: 'MARK_SHARED_LINK_AS_ERROR';
	readonly url: Url;
};

type ReceiveSharedLinkData = {
	readonly type: 'RECEIVE_SHARED_LINK_DATA';
	readonly url: Url;
	readonly data: SharedLink;
};
