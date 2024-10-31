/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import {
	controls,
	createReduxStore,
	dispatch,
	register,
	select,
	subscribe,
} from '@safe-wordpress/data';
import domReady from '@safe-wordpress/dom-ready';

/**
 * External dependencies
 */
import { getValue, logError, setValue } from '@nelio-content/utils';
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
export const store = createReduxStore( 'nelio-content/data', {
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

const renewAuthenticationToken = () => {
	try {
		void apiFetch< string >( {
			path: '/nelio-content/v1/authentication-token',
		} ).then( ( token ) => {
			const { receiveAuthenticationToken } = dispatch( store );
			void receiveAuthenticationToken( token );
		} );
	} catch ( e ) {
		logError( e );
	} //end catch
};
const MINS = 60000;
setInterval( renewAuthenticationToken, 5 * MINS );

function listenToPublicationPause() {
	let prevState = select( store ).isSocialPublicationPaused();
	subscribe( () => {
		const state = select( store ).isSocialPublicationPaused();
		if ( prevState !== state ) {
			setValue( 'isSocialPublicationPaused', state );
		} //end if
		prevState = state;
	}, store );
} //end listenToPublicationPause()
listenToPublicationPause();

function loadDefaultTimes() {
	const postTime = getValue( 'defaultPostTime', '10:00' );
	void dispatch( store ).setDefaultTime( 'post', postTime );

	const socialTime = getValue( 'defaultSocialTime', '10:00' );
	void dispatch( store ).setDefaultTime( 'social', socialTime );
} //end loadDefaultTimes()
domReady( loadDefaultTimes );
