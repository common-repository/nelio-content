/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { StrictMode } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
	useFirstDay,
	useNumberOfVisibleDays,
	useSidePane,
} from '@nelio-content/calendar';
import {
	getPremiumComponent,
	ContextualHelp,
	PremiumDialog,
} from '@nelio-content/components';
import { PostQuickEditor } from '@nelio-content/post-quick-editor';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';
import { TaskEditor } from '@nelio-content/task-editor';

/**
 * Internal dependencies
 */
import './style.scss';

import { walkthrough } from '../../walkthrough';
import { Header } from '../header';
import { Grid } from '../grid';
import { SidePane } from '../side-pane';

import { ExportDialog } from '../export-dialog';
import { ExternalCalendarManager } from '../external-calendar-manager';
import { RecurringDialog } from '../recurring-dialog';
import { TaskViewer } from '../task-viewer';

export const Layout = (): JSX.Element => {
	const firstDay = useFirstDay();
	const numberOfDays = useNumberOfVisibleDays();
	const sidePane = useSidePane();

	const FutureActionEditor = getPremiumComponent(
		'calendar/future-action-editor',
		'null'
	);

	return (
		<StrictMode>
			<SlotFillProvider>
				<DndProviderHelper>
					<div className="nelio-content-calendar">
						<Header className="nelio-content-calendar__header" />

						<Grid
							className={ classnames( {
								'nelio-content-calendar__grid': true,
								'nelio-content-calendar__grid--has-sidebar':
									'none' !== sidePane,
								'nelio-content-calendar__grid--has-banner-sidebar':
									'subscribe-banner' === sidePane,
							} ) }
							firstDay={ firstDay }
							numberOfDays={ numberOfDays }
						/>
						<SidePane />
					</div>
				</DndProviderHelper>

				<ExportDialog />
				<ExternalCalendarManager />
				<RecurringDialog />

				<PostQuickEditor context="calendar" />
				<SocialMessageEditor />
				<FutureActionEditor />
				<TaskEditor />
				<TaskViewer />

				<PremiumDialog />

				<ContextualHelp
					context="editorial-calendar"
					component={ () => null }
					autostart={ true }
					walkthrough={ walkthrough }
				/>

				<Popover.Slot />
			</SlotFillProvider>
		</StrictMode>
	);
};

// =====
// HOOKS
// =====

// NOTE: This is a TS workaround.
const DndProviderHelper = ( { children }: { children: JSX.Element } ) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore:next-line
	<DndProvider backend={ HTML5Backend }>{ children }</DndProvider>
);
