/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { applyFilters } from '@safe-wordpress/hooks';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import moment from 'moment';
import { store as NC_DATA } from '@nelio-content/data';
import { date } from '@nelio-content/date';
import { isEmpty, showErrorNotice } from '@nelio-content/utils';
import type { EditorialTask, Post, SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../store';

export async function loadItemsNow(): Promise< void > {
	try {
		await loadItemsIn( 0 );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end loadItemsNow()

export async function loadItemsIn( delay: number ): Promise< void > {
	const loaderTimeout = select( NC_CALENDAR ).getLoaderTimeout();
	if ( loaderTimeout ) {
		clearTimeout( loaderTimeout );
	} //end if

	if ( ! delay ) {
		try {
			await doLoadItems();
		} catch ( e ) {
			await showErrorNotice( e );
		} //end catch
		return;
	} //end if

	const newLoaderTimeout = setTimeout(
		() => void dispatch( NC_CALENDAR ).loadItemsNow(),
		delay
	);

	await dispatch( NC_CALENDAR ).setLoaderTimeout( newLoaderTimeout );
} //end loadItemsIn()

// =======
// HELPERS
// =======

async function doLoadItems() {
	await dispatch( NC_CALENDAR ).setLoaderTimeout( 0 );
	const firstDayOfWeek = select( NC_DATA ).getFirstDayOfWeek();

	const firstDay = select( NC_CALENDAR ).getFirstDay( firstDayOfWeek );
	const lastDay = select( NC_CALENDAR ).getLastDay( firstDayOfWeek );
	await dispatch( NC_CALENDAR ).markPeriodAsLoading( firstDay, lastDay );

	const isPeriodReady = select( NC_CALENDAR ).isPeriodReady(
		firstDay,
		lastDay
	);
	if ( isPeriodReady ) {
		await dispatch( NC_CALENDAR ).markPeriodAsLoaded( firstDay, lastDay );
		return;
	} //end if

	const startDay = date( 'Y-m-d', moment( firstDay ).add( -2, 'days' ) );
	const endDay = date( 'Y-m-d', moment( lastDay ).add( 2, 'days' ) );

	try {
		await Promise.all( [
			loadPostsInPeriod( startDay, endDay ),
			loadSocialMessagesInPeriod( startDay, endDay ),
			loadTasksInPeriod( startDay, endDay ),
			loadPremiumItemsInPeriod( startDay, endDay ),
		] );
		await dispatch( NC_CALENDAR ).markPeriodAsLoaded( firstDay, lastDay );
	} catch ( e ) {
		await dispatch( NC_CALENDAR ).markPeriodAsLoaded( firstDay, lastDay );
		throw e;
	} //end catch
} //end loadItems()

async function loadPostsInPeriod( startDay: string, endDay: string ) {
	try {
		const postTypes = select( NC_DATA )
			.getPostTypes( 'calendar' )
			.map( ( pt ) => pt.name );
		const posts = await apiFetch< ReadonlyArray< Post > >( {
			path: addQueryArgs( '/nelio-content/v1/calendar/posts', {
				from: startDay,
				to: endDay,
				type: postTypes.join( ',' ),
			} ),
			method: 'GET',
		} );

		await dispatch( NC_DATA ).receivePosts( posts );
	} catch ( error ) {
		throw error;
	} //end catch
} //end loadPostsInPeriod()

async function loadPremiumItemsInPeriod( startDay: string, endDay: string ) {
	try {
		await Promise.all(
			applyFilters(
				'nelio-content_data_loadPremiumItemsInPeriod',
				[ new Promise< void >( ( r ) => r() ) ],
				startDay,
				endDay
			) as Promise< unknown >[]
		);
	} catch ( error ) {
		throw error;
	} //end catch
} //end loadPremiumItemsInPeriod()

type AwsSocialResponse = {
	readonly messages: ReadonlyArray< SocialMessage >;
	readonly isMessagePublicationPaused: boolean;
	readonly page?: string;
};

async function loadSocialMessagesInPeriod(
	startDay: string,
	endDay: string,
	page?: string
) {
	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const response = await apiFetch< AwsSocialResponse >( {
			url: addQueryArgs(
				`${ apiRoot }/site/${ siteId }/calendar/messages`,
				{
					from: startDay,
					to: endDay,
					page,
				}
			),
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		if ( isEmpty( response.messages ) ) {
			return;
		} //end if

		await dispatch( NC_DATA ).receiveSocialMessages( response.messages );
		await dispatch( NC_DATA ).markSocialPublicationAsPaused(
			response.isMessagePublicationPaused
		);

		if ( response.page ) {
			await loadSocialMessagesInPeriod( startDay, endDay, response.page );
		} //end if
	} catch ( error ) {
		throw error;
	} //end catch
} //end loadSocialMessagesInPeriod()

type AwsTaskResponse = {
	readonly tasks: ReadonlyArray< EditorialTask >;
	readonly page?: string;
};

async function loadTasksInPeriod(
	startDay: string,
	endDay: string,
	page?: string
) {
	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const response = await apiFetch< AwsTaskResponse >( {
			url: addQueryArgs( `${ apiRoot }/site/${ siteId }/calendar/tasks`, {
				from: startDay,
				to: endDay,
				page,
			} ),
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		if ( isEmpty( response.tasks ) ) {
			return;
		} //end if

		await dispatch( NC_DATA ).receiveTasks( response.tasks );

		if ( response.page ) {
			await loadTasksInPeriod( startDay, endDay, response.page );
		} //end if
	} catch ( error ) {
		throw error;
	} //end catch
} //end loadTasksInPeriod()
