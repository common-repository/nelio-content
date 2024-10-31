/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as feeds } from './feeds/reducer';
import { reducer as settings } from './settings/reducer';

export const reducer = combineReducers( {
	feeds,
	settings,
} );
