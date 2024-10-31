/**
 * External dependencies
 */
import { trim } from 'lodash';
import type {
	Maybe,
	ReusableSocialMessage,
	ReusableSocialMessageId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';
import type { ReusableMessageQueryStatus } from './config';

export function getReusableMessage(
	state: State,
	id?: ReusableSocialMessageId
): Maybe< ReusableSocialMessage > {
	return id ? state.entities.reusableMessages.byId[ id ] : undefined;
} //end getReusableMessage()

export function getReusableMessages(
	state: State,
	query = ''
): ReadonlyArray< ReusableSocialMessage > {
	query = trim( query );
	return Object.values( state.entities.reusableMessages.byId ).filter(
		( m ) => m.textComputed.toLowerCase().includes( query.toLowerCase() )
	);
} //end getReusableMessages()

export function getReusableMessageQuery( state: State ): string {
	return state.entities.reusableMessages.loader.query;
} //end getReusableMessageQuery()

export function getReusableMessageQueryStatus(
	state: State,
	query: string
): ReusableMessageQueryStatus {
	query = trim( query );

	const { loader } = state.entities.reusableMessages;
	if ( loader.isFullyLoaded ) {
		return 'loaded';
	} //end if

	const status = loader.queryStatus[ query ];
	if ( status ) {
		return status;
	} //end if

	const isBroaderQueryLoaded = Object.keys( loader.queryStatus ).some(
		( q ) => query.includes( q ) && loader.queryStatus[ q ] === 'loaded'
	);
	return isBroaderQueryLoaded ? 'loaded' : 'pending';
} //end getReusableMessageQueryStatus()
