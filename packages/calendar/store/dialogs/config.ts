/**
 * External dependencies
 */
import type { Maybe, Uuid } from '@nelio-content/types';

export type State = {
	readonly isExportDialogOpen: boolean;
	readonly recurringAction: Maybe< RecurringAction >;
	readonly taskIdInTaskViewer: Maybe< Uuid >;
};

export const INIT_STATE: State = {
	isExportDialogOpen: false,
	recurringAction: undefined,
	taskIdInTaskViewer: undefined,
};

// ============
// HELPER TYPES
// ============

export type RecurringAction = RecurringTrashAction | RecurringRescheduleAction;

export type RecurringTrashAction = {
	readonly type: 'trash';
	readonly props: {
		readonly id: Uuid;
	};
};

export type RecurringRescheduleAction = {
	readonly type: 'reschedule';
	readonly props: {
		readonly id: Uuid;
		readonly day: string;
		readonly hour?: string;
	};
};
