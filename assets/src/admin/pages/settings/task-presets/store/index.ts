/**
 * WordPress dependencies
 */
import {
	select,
	dispatch,
	controls,
	createReduxStore,
	register,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { reducer } from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects';

export const store = createReduxStore( 'nelio-content/task-preset-settings', {
	reducer,
	controls,
	actions: { ...realActions, ...sideEffects },
	selectors,
} );
register( store );

// ====
// INIT
// ====

void dispatch( store ).resetTaskPresets( select( NC_DATA ).getTaskPresets() );
