/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { AuthorSearcher } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export const TaskFilter = (): JSX.Element => {
	const currentUserId = useSelect( ( select ) =>
		select( NC_DATA ).getCurrentUserId()
	);
	const areTasksVisible = useSelect( ( select ) =>
		select( NC_CALENDAR ).areTasksVisible()
	);
	const assigneeId = useSelect( ( select ) =>
		select( NC_CALENDAR ).getTaskAssigneeFilter()
	);

	const { setTaskAssigneeFilter } = useDispatch( NC_CALENDAR );
	const { toggleTasksVisibility } = useDispatch( NC_CALENDAR );

	return (
		<div className="nelio-content-task-filters">
			<CheckboxControl
				className="nelio-content-task-filters__visibility"
				checked={ areTasksVisible }
				onChange={ toggleTasksVisibility }
				label={ _x( 'Show tasks', 'command', 'nelio-content' ) }
			/>

			{ areTasksVisible && (
				<div className="nelio-content-task-filters__assignee">
					<span>{ _x( 'Assignee', 'text', 'nelio-content' ) }</span>

					<AuthorSearcher
						placeholder={ _x(
							'Search assignee…',
							'command',
							'nelio-content'
						) }
						value={ assigneeId }
						onChange={ setTaskAssigneeFilter }
						hasAllAuthors={ true }
						allAuthorsLabel={ _x(
							'All Assignees',
							'text',
							'nelio-content'
						) }
					/>

					<div className="nelio-content-task-filters__right-action">
						<Button
							variant="link"
							onClick={ () =>
								setTaskAssigneeFilter( currentUserId )
							}
						>
							{ _x(
								'Show My Tasks',
								'command',
								'nelio-content'
							) }
						</Button>
					</div>
				</div>
			) }
		</div>
	);
};
