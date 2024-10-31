/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { EditorialTask, Uuid } from '@nelio-content/types';

export type TaskAction = RemoveTaskAction | ReceiveTasksAction;

export function receiveTasks(
	tasks: EditorialTask | ReadonlyArray< EditorialTask >
): ReceiveTasksAction {
	return {
		type: 'RECEIVE_TASKS',
		tasks: castArray( tasks ),
	};
} //end receiveTasks()

export function removeTask( taskId: Uuid ): RemoveTaskAction {
	return {
		type: 'REMOVE_TASK',
		taskId,
	};
} //end removeTask()

// ============
// HELPER TYPES
// ============

type RemoveTaskAction = {
	readonly type: 'REMOVE_TASK';
	readonly taskId: Uuid;
};

type ReceiveTasksAction = {
	readonly type: 'RECEIVE_TASKS';
	readonly tasks: ReadonlyArray< EditorialTask >;
};
