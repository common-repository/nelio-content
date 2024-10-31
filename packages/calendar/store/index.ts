/**
 * WordPress dependencies
 */
import { controls, createReduxStore, register } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects';

export const store = createReduxStore( 'nelio-content/calendar', {
	reducer,
	controls,
	actions: { ...realActions, ...sideEffects },
	selectors,
} );
register( store );
