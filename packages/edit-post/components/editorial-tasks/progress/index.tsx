/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { filter } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const Progress = (): JSX.Element | null => {
	const { completed, total } = useProgress();

	if ( ! total ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-tasks-progress">
			<div className="nelio-content-tasks-progress__bar-background">
				<div
					className={ classnames( {
						'nelio-content-tasks-progress__bar': true,
						'nelio-content-tasks-progress__bar--is-completed':
							completed === total,
					} ) }
					style={ {
						width: `${ Math.round(
							( completed * 100 ) / total
						) }%`,
					} }
				></div>
			</div>
			<div className="nelio-content-tasks-progress__percentage">
				{ Math.round( ( completed * 100 ) / total ) }%
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useProgress = () =>
	useSelect( ( select ) => {
		const { getPostId } = select( NC_EDIT_POST );
		const { getTasksRelatedToPost } = select( NC_DATA );

		const tasks = getTasksRelatedToPost( getPostId() );
		const completedTasks = filter( tasks, { completed: true } );

		return {
			completed: completedTasks.length,
			total: tasks.length,
		};
	} );
