/*
 * External dependencies
 */
import type { PostTypeName } from '@nelio-content/types';

export const DEFAULT_ATTRS: Attrs = {
	postTypes: [],
	isMandatory: false,
	help: '',
};

export type Attrs = {
	readonly postTypes: ReadonlyArray< {
		readonly value: PostTypeName;
		readonly label: string;
	} >;
	readonly isMandatory: boolean;
	readonly help: string;
};

export type Value = ReadonlyArray< PostTypeName >;
