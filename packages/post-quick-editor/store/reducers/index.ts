/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { presetLoader } from './preset-loader';
import { status } from './status';

export default combineReducers( {
	attributes,
	presetLoader,
	status,
} );
