/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as board } from './board/reducer';
import { reducer as calendar } from './calendar/reducer';
import { reducer as entities } from './entities/reducer';
import { reducer as meta } from './meta/reducer';
import { reducer as social } from './social/reducer';

export const reducer = combineReducers( {
	board,
	calendar,
	entities,
	meta,
	social,
} );
