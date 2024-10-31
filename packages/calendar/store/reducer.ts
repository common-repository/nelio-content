/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as dialogs } from './dialogs/reducer';
import { reducer as entities } from './entities/reducer';
import { reducer as externalCalendars } from './external-calendars/reducer';
import { reducer as filters } from './filters/reducer';
import { reducer as interaction } from './interaction/reducer';
import { reducer as settings } from './settings/reducer';
import { reducer as status } from './status/reducer';

export default combineReducers( {
	dialogs,
	entities,
	externalCalendars,
	filters,
	interaction,
	settings,
	status,
} );
