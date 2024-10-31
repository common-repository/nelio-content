/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { castArray } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice, extractDateTimeValues } from '@nelio-content/utils';
import type { SocialMessage, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../../store';
import {
	setNewDayInSocialMessage,
	setNewDayAndTimeInSocialMessage,
} from '../../utils';

export async function rescheduleSocialMessage(
	socialId: Uuid,
	newLocalDay: string,
	newLocalHour?: string,
	disableRecurrence?: 'disable-recurrence'
): Promise< void > {
	const message = select( NC_DATA ).getSocialMessage( socialId );
	if ( ! message ) {
		return;
	} //end if

	const { dateValue: originalLocalDay, timeValue: originalLocalHour } =
		extractDateTimeValues( message.schedule ) ?? {};

	if (
		originalLocalDay === newLocalDay &&
		( ! newLocalHour || originalLocalHour === newLocalHour )
	) {
		return;
	} //end if

	const tmpMessage: SocialMessage = ! newLocalHour
		? setNewDayInSocialMessage( newLocalDay, message )
		: setNewDayAndTimeInSocialMessage( newLocalDay, newLocalHour, message );

	const newMessage = {
		...tmpMessage,
		recurrenceSettings: !! disableRecurrence
			? undefined
			: tmpMessage.recurrenceSettings,
	};

	if ( 'negative-days' === newMessage.dateType ) {
		return;
	} //end if

	try {
		await beginUpdate( newMessage );

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const result = await apiFetch<
			[ SocialMessage, ...SocialMessage[] ] | SocialMessage
		>( {
			url: `${ apiRoot }/site/${ siteId }/social/${ socialId }`,
			method: 'PUT',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: {
				...newMessage,
				baseDatetime: 'reschedule',
			},
		} );

		await commitUpdate( message, result );
	} catch ( error ) {
		await rollback( message, error );
	} //end catch
} //end rescheduleSocialMessage()

export async function deleteSocialMessage(
	socialId: Uuid,
	following?: 'following'
): Promise< void > {
	const message = select( NC_DATA ).getSocialMessage( socialId );
	if ( ! message ) {
		return;
	} //end if

	try {
		await beginDeletion( message );

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const updated = await apiFetch< ReadonlyArray< SocialMessage > >( {
			url: `${ apiRoot }/site/${ siteId }/social/${ socialId }${
				!! following ? '/following' : ''
			}`,
			method: 'DELETE',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await commitDeletion( message, updated );
	} catch ( error ) {
		await rollback( message, error );
	} //end catch
} //end deleteSocialMessage()

// =======
// HELPERS
// =======

async function beginUpdate( message: SocialMessage ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( message ) );
	await dispatch( NC_DATA ).receiveSocialMessages( message );
} //end beginUpdate()

async function commitUpdate(
	original: SocialMessage,
	updated: [ SocialMessage, ...SocialMessage[] ] | SocialMessage
) {
	await dispatch( NC_DATA ).removeRecurringMessages(
		original.recurrenceGroup
	);
	await dispatch( NC_DATA ).receiveSocialMessages( updated );
	castArray( updated )
		.map( summarize )
		.filter( ( { type, id } ) =>
			select( NC_CALENDAR ).isSynching( type, id )
		)
		.forEach( dispatch( NC_CALENDAR ).markAsUpdated );
} //end commitUpdate()

async function beginDeletion( message: SocialMessage ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( message ) );
	await dispatch( NC_DATA ).removeSocialMessage( message.id );
} //end beginDeletion()

async function commitDeletion(
	deleted: SocialMessage,
	updated: ReadonlyArray< SocialMessage >
) {
	await dispatch( NC_DATA ).removeSocialMessage( deleted.id );
	await dispatch( NC_DATA ).removeRecurringMessages(
		deleted.recurrenceGroup
	);
	await dispatch( NC_DATA ).receiveSocialMessages( updated );
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( deleted ) );
} //end commitDeletion()

async function rollback( message: SocialMessage, error: unknown ) {
	await dispatch( NC_DATA ).receiveSocialMessages( message );
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( message ) );
	await showErrorNotice( error );
} //end rollback()

function summarize( message: SocialMessage ) {
	return {
		type: 'social' as const,
		id: message.id,
		relatedPostId: message.postId,
		recurrenceGroup: message.recurrenceGroup,
	};
} //end summarize()
