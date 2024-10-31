/**
 * External dependencies
 */
import type { ExternalCalendar, Maybe, Url } from '@nelio-content/types';

export type State = {
	readonly isManaging: boolean;
	readonly byUrl: Record< Url, ExternalCalendar >;
	readonly deleting: ReadonlyArray< Url >;
	readonly editor: Maybe< {
		readonly isNew: boolean;
		readonly isSaving: boolean;
		readonly name: string;
		readonly url: string;
	} >;
};

export const INIT_STATE: State = {
	isManaging: false,
	byUrl: {},
	deleting: [],
	editor: undefined,
};
