/**
 * WordPress dependencies
 */
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = dispatch( NC_EDIT_POST );
export type Actions = typeof actions;
