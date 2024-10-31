/**
 * External dependencies
 */
import type {
	AuthorId,
	EditorialTask,
	Maybe,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getId( state: State ): Maybe< Uuid > {
	return state.attributes.id;
} //end getId()

export function getTask( state: State ): string {
	return state.attributes.task;
} //end getTask()

export function getAssigneeId( state: State ): Maybe< AuthorId > {
	return state.attributes.assigneeId;
} //end getAssigneeId()

export function getDateType( state: State ): EditorialTask[ 'dateType' ] {
	return state.attributes.dateType;
} //end getDateType()

export function getDateValue( state: State ): EditorialTask[ 'dateValue' ] {
	return state.attributes.dateValue;
} //end getDateValue()

export function getColor( state: State ): EditorialTask[ 'color' ] {
	return state.attributes.color;
} //end getColor()

export function getAttributes( state: State ): State[ 'attributes' ] {
	return state.attributes;
} //end getAttributes()
