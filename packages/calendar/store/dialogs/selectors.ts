/**
 * External dependencies
 */
import type { Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { RecurringAction } from './config';
import type { State } from '../config';

export function isExportDialogOpen( state: State ): boolean {
	return state.dialogs.isExportDialogOpen;
} //end isExportDialogOpen()

export function getTaskIdInTaskViewer( state: State ): Maybe< Uuid > {
	return state.dialogs.taskIdInTaskViewer || undefined;
} //end getTaskIdInTaskViewer()

export function getRecurringAction( state: State ): Maybe< RecurringAction > {
	return state.dialogs.recurringAction;
} //end getRecurringAction()

export function isTaskViewerDialogOpen( state: State ): boolean {
	return !! state.dialogs.taskIdInTaskViewer;
} //end isTaskViewerDialogOpen()
