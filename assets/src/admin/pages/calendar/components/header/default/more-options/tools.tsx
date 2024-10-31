/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { MenuGroup, MenuItem } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { ContextualHelp } from '@nelio-content/components';
import {
	store as NC_DATA,
	useFeatureGuard,
	useIsFeatureEnabled,
} from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { ExportDialog } from '../../../export-dialog';
import { walkthrough } from '~/nelio-content-pages/calendar/walkthrough';

export type ToolsProps = {
	readonly close: () => void;
};

export const Tools = ( { close }: ToolsProps ): JSX.Element => {
	const canExportCalendar = useIsFeatureEnabled( 'calendar/export' );
	const exportCalendarGuard = useFeatureGuard( 'calendar/export' );
	const canPauseCalendar = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserManagePlugin()
	);
	const isSocialPublicationPaused = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationPaused()
	);
	const isSocialPublicationStatusBeingSynched = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationStatusBeingSynched()
	);

	const { toggleSocialPublicationStatus } = useDispatch( NC_DATA );
	const { openExportDialog } = useDispatch( NC_CALENDAR );
	const { clearFilters } = useDispatch( NC_CALENDAR );

	return (
		<MenuGroup label={ _x( 'Tools', 'text', 'nelio-content' ) }>
			<MenuItem
				role="menuitem"
				disabled={
					isSocialPublicationStatusBeingSynched || ! canPauseCalendar
				}
				onClick={ toggleSocialPublicationStatus }
			>
				{ isSocialPublicationPaused &&
					! isSocialPublicationStatusBeingSynched &&
					_x(
						'Resume Social Publication',
						'command',
						'nelio-content'
					) }
				{ ! isSocialPublicationPaused &&
					! isSocialPublicationStatusBeingSynched &&
					_x(
						'Pause Social Publication',
						'command',
						'nelio-content'
					) }
				{ isSocialPublicationPaused &&
					isSocialPublicationStatusBeingSynched &&
					_x(
						'Resuming Social Publication…',
						'text',
						'nelio-content'
					) }
				{ ! isSocialPublicationPaused &&
					isSocialPublicationStatusBeingSynched &&
					_x(
						'Pausing Social Publication…',
						'text',
						'nelio-content'
					) }
			</MenuItem>

			<MenuItem
				role="menuitem"
				icon={ canExportCalendar ? undefined : 'lock' }
				onClick={ () => {
					close();
					exportCalendarGuard( openExportDialog )();
				} }
			>
				{ _x( 'Export Calendar', 'command', 'nelio-content' ) }
				<ExportDialog />
			</MenuItem>

			<MenuItem
				role="menuitem"
				onClick={ () => {
					close();
					window.print();
				} }
			>
				{ _x( 'Print Calendar', 'command', 'nelio-content' ) }
			</MenuItem>

			<MenuItem
				role="menuitem"
				onClick={ () => {
					close();
					void clearFilters();
				} }
			>
				{ _x( 'Clear Filters', 'command', 'nelio-content' ) }
			</MenuItem>

			<ContextualHelp
				context="editorial-calendar"
				walkthrough={ walkthrough }
				component={ HelpMenuItem( close ) }
			/>
		</MenuGroup>
	);
};

// ============
// HELPER VIEWS
// ============

type HMIProps = {
	readonly runWalkthrough: () => void;
};

const HelpMenuItem = ( close: () => void ) => ( props: HMIProps ) => (
	<MenuItem
		role="menuitem"
		onClick={ () => {
			setTimeout( close, 0 );
			props.runWalkthrough();
		} }
	>
		{ _x( 'Help', 'text', 'nelio-content' ) }
	</MenuItem>
);
