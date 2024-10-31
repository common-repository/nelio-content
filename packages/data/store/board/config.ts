/**
 * External dependencies
 */
import type {
	BoardPostSummary,
	PostStatusSlug,
	PostTypeName,
} from '@nelio-content/types';

export type State = {
	readonly statuses: Record<
		PostStatusSlug,
		ReadonlyArray< BoardPostSummary >
	>;
	readonly validPostTypes: ReadonlyArray< PostTypeName >;
};

export const INIT: State = {
	statuses: {},
	validPostTypes: [],
};
