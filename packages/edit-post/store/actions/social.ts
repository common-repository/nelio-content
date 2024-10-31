/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

export type SocialAction =
	| MarkSocialMessageAsDeletingAction
	| MarkTimelineAsGeneratingAction
	| MarkTimelineAsClearingAction;

export function markSocialMessageAsDeleting(
	messageId: Uuid,
	isDeleting: boolean
): MarkSocialMessageAsDeletingAction {
	return {
		type: 'MARK_SOCIAL_MESSAGE_AS_DELETING',
		messageId,
		isDeleting,
	};
} //end markSocialMessageAsDeleting()

export function markTimelineAsGenerating(
	isGenerating: boolean
): MarkTimelineAsGeneratingAction {
	return {
		type: 'MARK_TIMELINE_AS_GENERATING',
		isGenerating,
	};
} //end markTimelineAsGenerating()

export function markTimelineAsClearing(
	isClearing: boolean
): MarkTimelineAsClearingAction {
	return {
		type: 'MARK_TIMELINE_AS_CLEARING',
		isClearing,
	};
} //end markTimelineAsClearing()

// ============
// HELPER TYPES
// ============

type MarkSocialMessageAsDeletingAction = {
	readonly type: 'MARK_SOCIAL_MESSAGE_AS_DELETING';
	readonly messageId: Uuid;
	readonly isDeleting: boolean;
};

type MarkTimelineAsGeneratingAction = {
	readonly type: 'MARK_TIMELINE_AS_GENERATING';
	readonly isGenerating: boolean;
};

type MarkTimelineAsClearingAction = {
	readonly type: 'MARK_TIMELINE_AS_CLEARING';
	readonly isClearing: boolean;
};
