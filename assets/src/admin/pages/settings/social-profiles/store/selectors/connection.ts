/**
 * External dependencies
 */
import type { Maybe, SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getKindDialog( state: State ): Maybe< SocialNetworkName > {
	return state.connection.kindDialog;
} //end getKindDialog()

export function getConnectionDialog( state: State ): Maybe< Window > {
	return state.connection.connectionDialog;
} //end getConnectionDialog()
