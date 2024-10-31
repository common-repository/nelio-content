/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as pages } from './pages/reducer';
import { reducer as plugin } from './plugin/reducer';
import { reducer as site } from './site/reducer';
import { reducer as user } from './user/reducer';

export const reducer = combineReducers( {
	pages,
	plugin,
	site,
	user,
} );
