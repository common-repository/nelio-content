/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, TabPanel } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

import { PostFilter } from './post';
import { SocialFilter } from './social';
import { TaskFilter } from './task';
import { EventFilter } from './event';

export type CalendarFilterProps = {
	readonly className?: string;
};

export const CalendarFilters = ( {
	className,
}: CalendarFilterProps ): JSX.Element => {
	const activeTab = useSelect( ( select ) =>
		select( NC_CALENDAR ).getActiveTabInFilterPane()
	);
	const { setActiveTabInFilterPane: setTab } = useDispatch( NC_CALENDAR );

	const tabs = [
		{
			name: 'post' as const,
			title: <Dashicon icon="admin-post" />,
			className: 'nelio-content-calendar-filters__tab',
		},
		{
			name: 'social' as const,
			title: <Dashicon icon="share" />,
			className: 'nelio-content-calendar-filters__tab',
		},
		{
			name: 'task' as const,
			title: <Dashicon icon="flag" />,
			className: 'nelio-content-calendar-filters__tab',
		},
		{
			name: 'event' as const,
			title: <Dashicon icon="calendar-alt" />,
			className: 'nelio-content-calendar-filters__tab',
		},
	];

	return (
		<div
			className={ classnames(
				'nelio-content-calendar-filters',
				className
			) }
		>
			<TabPanel
				className="nelio-content-calendar-filters__tab-panel"
				activeClass="nelio-content-calendar-filters__tab--is-active"
				orientation="horizontal"
				initialTabName={ activeTab }
				tabs={ tabs }
				onSelect={ ( tab ) => void setTab( tab ) }
			>
				{ ( { name: tab } ) => (
					<>
						{ 'post' === tab && <PostFilter /> }
						{ 'social' === tab && <SocialFilter /> }
						{ 'task' === tab && <TaskFilter /> }
						{ 'event' === tab && <EventFilter /> }
					</>
				) }
			</TabPanel>
		</div>
	);
};
