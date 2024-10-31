/**
 * WordPress dependencies
 */
import {
	controls,
	createReduxStore,
	dispatch,
	register,
	select,
	subscribe,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { getValue, setValue } from '@nelio-content/utils';
import type {
	Dict,
	WithResolverSelect,
	WithResolverDispatch,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import reducer from './reducers';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects/actions';
import * as resolvers from './side-effects/resolvers';

const actions = { ...realActions, ...sideEffects };
export const store = createReduxStore( 'nelio-content/edit-post', {
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

// ================
// ADDITIONAL STUFF
// ================

function synchStoreWithLocalStorage() {
	const { setPanelSettings } = dispatch( store );
	void setPanelSettings(
		getValue< Dict< boolean > >( 'panelSettings', {} ) || {}
	);

	let prevPanelSettings = select( store ).getPanelStatuses();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const panelSettings = select( store ).getPanelStatuses();
		if ( prevPanelSettings === panelSettings ) {
			return;
		} //end if
		prevPanelSettings = panelSettings;
		setValue( 'panelSettings', panelSettings );
	}, store );
} //end synchStoreWithLocalStorage()
synchStoreWithLocalStorage();
