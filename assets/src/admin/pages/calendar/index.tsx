/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import domReady from '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';
import { render } from '@safe-wordpress/element';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import type { CalendarSettings } from '@nelio-content/calendar';
import type { ExternalCalendar } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import {
	getPreviousFilters,
	getPreviousSettings,
	listenToStoreChanges,
	makeGridResizable,
	trackFocusDay,
} from './utils';

import { Layout } from './components/layout';

type Settings = Pick<
	CalendarSettings,
	| 'calendarTimeFormat'
	| 'focusDay'
	| 'icsLinks'
	| 'numberOfNonCollapsableMessages'
	| 'simplifyCalendarTime'
> & {
	readonly externalCalendars: ReadonlyArray< ExternalCalendar >;
};

export function initPage(
	id: string,
	{ externalCalendars, ...settings }: Settings
): void {
	const {
		initCalendarSettings,
		loadPreviousFilters,
		loadItemsNow,
		loadUnscheduledPosts,
		receiveExternalCalendars,
	} = dispatch( NC_CALENDAR );

	void initCalendarSettings( { ...settings, ...getPreviousSettings() } );
	void receiveExternalCalendars( externalCalendars );
	void loadPreviousFilters( getPreviousFilters() );
	trackFocusDay();

	domReady( () => {
		void loadItemsNow();
		void loadUnscheduledPosts();

		const { getInternalEvents, getExternalEvents } = select( NC_DATA );
		getInternalEvents();
		externalCalendars.forEach(
			( { url } ) => void getExternalEvents( url )
		);

		const content = document.getElementById( id );
		render( <Layout />, content );

		listenToStoreChanges();
		makeGridResizable();
	} );
} //end initPage()
