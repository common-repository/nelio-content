/**
 * External dependencies
 */
import type { FeedId, Maybe } from '@nelio-content/types';

export type State = {
	readonly active: boolean;
	readonly addFeedForm: {
		readonly url: string;
		readonly isAddingFeed: boolean;
	};
	readonly feedEditor: Maybe< {
		readonly isSaving: boolean;
		readonly feedId: FeedId;
		readonly feedName: string;
		readonly feedTwitter: string;
	} >;
	readonly feedsBeingDeleted: ReadonlyArray< FeedId >;
};

export const INIT_STATE: State = {
	active: false,
	addFeedForm: {
		url: '',
		isAddingFeed: false,
	},
	feedEditor: undefined,
	feedsBeingDeleted: [],
};
