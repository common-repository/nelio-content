/**
 * External dependencies
 */
import { map } from 'lodash';
import { isDefined } from '@nelio-content/utils';
import type { EditorialTask, Maybe, PostId, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getTask( state: State, id?: Uuid ): Maybe< EditorialTask > {
	return id ? state.entities.tasks.byId[ id ] : undefined;
} //end getTask()

export function getTasksRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< EditorialTask > {
	const summaries = !! postId && state.entities.tasks.byRelatedPost[ postId ];
	if ( ! summaries ) {
		return [];
	} //end if

	return map( summaries, ( { id } ) => getTask( state, id ) ).filter(
		isDefined
	);
} //end getTasksRelatedToPost()

export function getTaskIdsRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< Uuid > {
	return map( getTasksRelatedToPost( state, postId ), 'id' );
} //end getTaskIdsRelatedToPost()
