/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { useSidePane } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import { CalendarFilters } from './calendar-filters';
import { ErrorPane } from './error-pane';
import { ReusableMessages } from './reusable-messages';
import { SubscribeSidebar } from './subscribe-sidebar';
import { UnscheduledPosts } from './unscheduled-posts';

export const SidePane = (): JSX.Element | null => {
	const sidePane = useSidePane();

	switch ( sidePane ) {
		case 'none':
			return null;

		case 'unscheduled-posts':
			return (
				<UnscheduledPosts className="nelio-content-calendar__sidebar" />
			);

		case 'reusable-messages':
			return (
				<ReusableMessages className="nelio-content-calendar__sidebar" />
			);

		case 'filters':
			return (
				<CalendarFilters className="nelio-content-calendar__sidebar" />
			);

		case 'subscribe-banner':
			return (
				<SubscribeSidebar className="nelio-content-calendar__sidebar nelio-content-calendar__sidebar--is-banner" />
			);

		case 'errors':
			return <ErrorPane className="nelio-content-calendar__sidebar" />;
	} //end switch
};
