/**
 * External dependencies
 */
import type { ItemSummary, PostTypeName } from '@nelio-content/types';

type Day = string;
export type State = {
	readonly days: Record< Day, ReadonlyArray< ItemSummary > >;
	readonly validPostTypes: {
		readonly posts: ReadonlyArray< PostTypeName >;
		readonly tasks: ReadonlyArray< PostTypeName >;
	};
};

export const INIT: State = {
	days: {},
	validPostTypes: {
		posts: [],
		tasks: [],
	},
};
