/**
 * External dependencies
 */
import type { AuthorId, EditorialTask, Maybe } from '@nelio-content/types';

export type AttributeAction =
	| SetTaskAction
	| SetAssigneeIdAction
	| SetDateTypeAction
	| SetDateValueAction
	| SetColorAction;

export function setTask( task: string ): SetTaskAction {
	return {
		type: 'SET_TASK',
		task,
	};
} //end setTask()

export function setAssigneeId(
	assigneeId: Maybe< AuthorId >
): SetAssigneeIdAction {
	return {
		type: 'SET_ASSIGNEE_ID',
		assigneeId,
	};
} //end setAssigneeId()

export function setDateType(
	dateType: EditorialTask[ 'dateType' ]
): SetDateTypeAction {
	return {
		type: 'SET_DATE_TYPE',
		dateType,
	};
} //end setDateType()

export function setDateValue(
	dateValue: EditorialTask[ 'dateValue' ]
): SetDateValueAction {
	return {
		type: 'SET_DATE_VALUE',
		dateValue,
	};
} //end setDateValue()

export function setColor( color: EditorialTask[ 'color' ] ): SetColorAction {
	return {
		type: 'SET_COLOR',
		color,
	};
} //end setColor()

// =======
// HELPERS
// =======

type SetTaskAction = {
	readonly type: 'SET_TASK';
	readonly task: string;
};

type SetAssigneeIdAction = {
	readonly type: 'SET_ASSIGNEE_ID';
	readonly assigneeId: Maybe< AuthorId >;
};

type SetDateTypeAction = {
	readonly type: 'SET_DATE_TYPE';
	readonly dateType: EditorialTask[ 'dateType' ];
};

type SetDateValueAction = {
	readonly type: 'SET_DATE_VALUE';
	readonly dateValue: EditorialTask[ 'dateValue' ];
};

type SetColorAction = {
	readonly type: 'SET_COLOR';
	readonly color: EditorialTask[ 'color' ];
};
