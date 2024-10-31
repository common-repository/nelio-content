/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { recurrence } from './recurrence';
import { status } from './status';
import { targetSelector } from './target-selector';

export default combineReducers( {
	attributes,
	recurrence,
	status,
	targetSelector,
} );
