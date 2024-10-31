/**
 * External dependencies
 */
import type {
	PostId,
	SocialMessage,
	SocialMessageSummary,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly byId: Record< Uuid, SocialMessage >;
	readonly byRelatedPost: Record<
		PostId,
		ReadonlyArray< SocialMessageSummary >
	>;
};

export const INIT: State = {
	byId: {},
	byRelatedPost: {},
};
