/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { ExternalCalendar, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../store';

export async function addExternalCalendar( url: Url ): Promise< void > {
	await dispatch( NC_CALENDAR ).markAsSaving( true );

	try {
		const externalCalendar = await apiFetch< ExternalCalendar >( {
			path: '/nelio-content/v1/external-calendars/',
			method: 'POST',
			data: { url },
		} );

		await dispatch( NC_CALENDAR ).receiveExternalCalendars(
			externalCalendar
		);
		await resolveSelect( NC_DATA ).getExternalEvents(
			externalCalendar.url
		);
		await dispatch( NC_CALENDAR ).closeExternalCalendarEditor();
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_CALENDAR ).markAsSaving( false );
} //end addExternalCalendar()

export async function saveExternalCalendar( {
	url,
	name,
}: ExternalCalendar ): Promise< void > {
	await dispatch( NC_CALENDAR ).markAsSaving( true );

	try {
		const externalCalendar = await apiFetch< ExternalCalendar >( {
			path: '/nelio-content/v1/external-calendars/',
			method: 'PUT',
			data: { url, name },
		} );

		await dispatch( NC_CALENDAR ).receiveExternalCalendars(
			externalCalendar
		);
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_CALENDAR ).closeExternalCalendarEditor();
	await dispatch( NC_CALENDAR ).markAsSaving( false );
} //end saveExternalCalendar()

export async function deleteExternalCalendar( url: Url ): Promise< void > {
	await dispatch( NC_CALENDAR ).markAsDeleting( url, true );

	try {
		await apiFetch( {
			path: addQueryArgs( '/nelio-content/v1/external-calendars/', {
				url,
			} ),
			method: 'DELETE',
		} );

		await dispatch( NC_CALENDAR ).removeExternalCalendar( url );
		const events = await resolveSelect( NC_DATA ).getExternalEvents( url );
		await dispatch( NC_DATA ).invalidateResolution( 'getExternalEvents', [
			url,
		] );
		await dispatch( NC_DATA ).removeExternalEvents(
			events.map( ( e ) => e.id )
		);
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_CALENDAR ).markAsDeleting( url, false );
} //end deleteExternalCalendar()
