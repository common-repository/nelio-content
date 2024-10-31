/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { PostStatus } from '@nelio-content/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = dispatch( NC_EDIT_POST );
export type Actions = typeof actions;

export type Elementor = {
	readonly settings: {
		readonly page: {
			readonly model: {
				readonly on: (
					trigger: string,
					callback: ( model: ElementorModel ) => void
				) => void;
			};
		};
	};
	readonly $previewWrapper: {
		readonly data: ( key: string ) => unknown;
		readonly addClass: ( classname: string ) => void;
		readonly removeClass: ( classname: string ) => void;
	};
	readonly channels: {
		readonly editor: {
			readonly on: (
				trigger: string,
				callback: ( data: ElementorSaveData ) => void
			) => void;
		};
	};
};

export type ElementorFrontend = {
	readonly getElements: () => { $document: ReadonlyArray< Document > };
};

type ElementorModel = {
	readonly get: ( key: string ) => unknown;
};

type ElementorSaveData = {
	readonly status: PostStatus;
};

export const isElementor = ( x?: unknown ): x is Elementor =>
	!! x && typeof x === 'object' && 'settings' in x;

export const isElementorFrontend = ( x?: unknown ): x is ElementorFrontend =>
	!! x && typeof x === 'object' && 'getElements' in x;
