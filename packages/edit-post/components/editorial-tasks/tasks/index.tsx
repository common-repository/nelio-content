/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { Task } from '../task';
import { store as NC_EDIT_POST } from '../../../store';

export const Tasks = (): JSX.Element => {
	const tasks = useTasks();

	if ( isEmpty( tasks ) ) {
		return (
			<div className="nelio-content-task-list nelio-content-task-list--is-empty">
				{ _x(
					'Keep track of the things that need to get done with tasks.',
					'user',
					'nelio-content'
				) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-task-list">
			{ tasks.map( ( task ) => (
				<Task key={ task } taskId={ task } />
			) ) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useTasks = () =>
	useSelect( ( select ) => {
		const { getPostId } = select( NC_EDIT_POST );
		const { getTaskIdsRelatedToPost } = select( NC_DATA );
		return getTaskIdsRelatedToPost( getPostId() );
	} );
