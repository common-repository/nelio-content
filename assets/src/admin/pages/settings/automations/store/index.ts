/**
 * WordPress dependencies
 */
import { controls, createReduxStore, register } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type {
	WithResolverSelect,
	WithResolverDispatch,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { reducer } from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects';
import * as resolvers from './resolvers';

const actions = { ...realActions, ...sideEffects };
export const store = createReduxStore( 'nelio-content/automation-settings', {
	reducer,
	controls,
	actions: actions as WithResolverDispatch<
		typeof actions,
		typeof resolvers
	>,
	selectors: selectors as WithResolverSelect<
		typeof selectors,
		typeof resolvers
	>,
	resolvers,
} );
register( store );
