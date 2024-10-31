/**
 * External dependencies
 */
import type {
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

export type State = {
	readonly byId: Record< ReusableSocialMessageId, ReusableSocialMessage >;
	readonly loader: {
		readonly query: string;
		readonly queryStatus: Record< string, ReusableMessageQueryStatus >;
		readonly isFullyLoaded: boolean;
	};
};

export const INIT: State = {
	byId: {},
	loader: {
		query: '',
		queryStatus: {},
		isFullyLoaded: false,
	},
};

export type ReusableMessageQueryStatus = 'pending' | 'loading' | 'loaded';
