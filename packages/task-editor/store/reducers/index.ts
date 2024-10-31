/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { status } from './status';

export default combineReducers( {
	attributes,
	status,
} );
