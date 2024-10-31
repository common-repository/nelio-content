/**
 * External dependencies
 */
import type { Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { RecurringRescheduleAction, RecurringTrashAction } from './config';

export type CustomDialogsAction =
	| OpenExportDialogAction
	| OpenTaskViewerDialogAction
	| RequestRecurringRescheduleMode
	| RequestRecurringTrashMode
	| CloseRecurringDialog;

export function openExportDialog( isOpen = true ): OpenExportDialogAction {
	return {
		type: 'OPEN_EXPORT_DIALOG',
		isOpen,
	};
} //end openExportDialog()

export function openTaskViewerDialog(
	taskId?: Uuid
): OpenTaskViewerDialogAction {
	return {
		type: 'OPEN_TASK_VIEWER_DIALOG',
		taskId,
	};
} //end openTaskViewerDialog()

export function requestRecurringRescheduleMode(
	props: RecurringRescheduleAction[ 'props' ]
): RequestRecurringRescheduleMode {
	return {
		type: 'REQUEST_RECURRING_RESCHEDULE_MODE',
		props,
	};
} //end requestRecurringRescheduleMode()

export function requestRecurringTrashMode(
	props: RecurringTrashAction[ 'props' ]
): RequestRecurringTrashMode {
	return {
		type: 'REQUEST_RECURRING_TRASH_MODE',
		props,
	};
} //end requestRecurringTrashMode()

export function closeRecurringDialog(): CloseRecurringDialog {
	return { type: 'CLOSE_RECURRING_DIALOG' };
} //end closeRecurringDialog()

// ============
// HELPER TYPES
// ============

type OpenExportDialogAction = {
	readonly type: 'OPEN_EXPORT_DIALOG';
	readonly isOpen: boolean;
};

type OpenTaskViewerDialogAction = {
	readonly type: 'OPEN_TASK_VIEWER_DIALOG';
	readonly taskId: Maybe< Uuid >;
};

type RequestRecurringRescheduleMode = {
	readonly type: 'REQUEST_RECURRING_RESCHEDULE_MODE';
	readonly props: RecurringRescheduleAction[ 'props' ];
};

type RequestRecurringTrashMode = {
	readonly type: 'REQUEST_RECURRING_TRASH_MODE';
	readonly props: RecurringTrashAction[ 'props' ];
};

type CloseRecurringDialog = {
	readonly type: 'CLOSE_RECURRING_DIALOG';
};
