/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { keyBy, values, without } from 'lodash';
import {
	store as NC_DATA,
	useAuthorName,
	withSubscriptionCheck,
} from '@nelio-content/data';
import {
	store as NC_TASK_EDITOR,
	TaskEditor,
} from '@nelio-content/task-editor';
import { createTask, getHumanDateDue } from '@nelio-content/utils';
import type {
	AuthorId,
	EditorialTask,
	PostId,
	PostStatusSlug,
	PostTypeName,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { TaskPresets } from './task-presets';
import { store as NC_POST_EDITOR } from '../../store';
import { DeleteButton } from '@nelio-content/components';

export const Tasks = (): JSX.Element => <InternalTasks />;

const InternalTasks = withSubscriptionCheck( 'raw/editorial-tasks', () => (
	<div className="nelio-content-pqe-extra__tasks">
		<TaskList />
		<TaskListActions />
		<TaskPresets />
		<TaskEditor />
	</div>
) );

// =======
// HELPERS
// =======

const TaskList = (): JSX.Element | null => {
	const tasks = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTasks()
	);

	return (
		<ul className="nelio-content-pqe-extra__task-list">
			{ tasks.map( ( task ) => (
				<Task key={ `nelio-content-task-${ task.id }` } task={ task } />
			) ) }
		</ul>
	);
};

const TaskListActions = (): JSX.Element => {
	const post = usePost();
	const { openTaskPresetLoader } = useDispatch( NC_POST_EDITOR );
	const { openNewTaskEditor } = useDispatch( NC_TASK_EDITOR );
	const { addTask } = useTaskActions();
	const { canEditSettings, hasTaskPresets, settingsUrl } = useSelect(
		( select ) => ( {
			canEditSettings: select( NC_DATA ).canCurrentUserManagePlugin(),
			hasTaskPresets: !! select( NC_DATA ).getTaskPresets().length,
			settingsUrl: select( NC_DATA ).getAdminUrl(
				'/admin.php?page=nelio-content-settings&subpage=tools--task-presets'
			),
		} )
	);
	return (
		<>
			<div className="nelio-content-pqe-extra__task-list-actions">
				{ hasTaskPresets && (
					<Button
						size="small"
						variant="secondary"
						onClick={ () => openTaskPresetLoader( true ) }
					>
						{ _x( 'Load Tasks', 'command', 'nelio-content' ) }
					</Button>
				) }
				<Button
					size="small"
					variant="secondary"
					onClick={ () =>
						openNewTaskEditor(
							{
								...createTask(),
								dateType: 'predefined-offset',
								dateValue: '0',
							},
							{
								context: 'post',
								post,
								onSave: addTask,
							}
						)
					}
				>
					{ _x( 'Add Task', 'command', 'nelio-content' ) }
				</Button>
			</div>
			{ ! hasTaskPresets && canEditSettings && (
				<div className="nelio-content-pqe-extra__configure-task-presets">
					<ExternalLink href={ settingsUrl }>
						{ _x(
							'Create reusable task presets now',
							'user',
							'nelio-content'
						) }
					</ExternalLink>
				</div>
			) }
		</>
	);
};

const Task = ( { task }: { task: EditorialTask } ) => {
	const assignee = useAuthorName(
		task.assigneeId,
		_x( 'Unknown Assignee', 'text', 'nelio-content' )
	);
	const date = getHumanDateDue( undefined, task.dateType, task.dateValue );

	const post = usePost();
	const { editTask, deleteTask } = useTaskActions();
	const { openExistingTaskEditor } = useDispatch( NC_TASK_EDITOR );
	const onEdit = () =>
		openExistingTaskEditor( task, {
			post,
			context: 'post',
			onSave: editTask,
		} );

	return (
		<li
			className={ classnames( 'nelio-content-pqe-extra__task', {
				'nelio-content-pqe-extra__task--completed': !! task.completed,
				[ `nelio-content-pqe-extra__task--is-${ task.color }` ]:
					!! task.color,
			} ) }
		>
			<div
				className={ classnames( 'nelio-content-pqe-extra__task-desc', {
					'nelio-content-pqe-extra__task-desc--completed':
						!! task.completed,
				} ) }
			>
				{ task.task }
			</div>
			<div className="nelio-content-pqe-extra__task-details">
				{ `${ assignee } • ${ date }` }
			</div>
			<div className="nelio-content-pqe-extra__task-actions">
				<Button size="small" variant="link" onClick={ onEdit }>
					{ _x( 'Edit', 'command', 'nelio-content' ) }
				</Button>
				<DeleteButton
					size="small"
					onClick={ () => deleteTask( task ) }
				/>
			</div>
		</li>
	);
};

// =====
// HOOKS
// =====

const usePost = () =>
	useSelect( ( select ) => ( {
		id: 0 as PostId,
		title: select( NC_POST_EDITOR ).getTitle(),
		type:
			select( NC_POST_EDITOR ).getPostType() ||
			( 'post' as PostTypeName ),
		author: select( NC_POST_EDITOR ).getAuthorId() || ( 0 as AuthorId ),
		date: select( NC_POST_EDITOR ).getDateValue(),
		status:
			select( NC_POST_EDITOR ).getPostStatus() ||
			select( NC_POST_EDITOR ).getPostStatus() ||
			( 'draft' as PostStatusSlug ),
		viewLink: '' as Url,
	} ) );

const useTaskActions = () => {
	const tasks = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTasks()
	);
	const { setTasks } = useDispatch( NC_POST_EDITOR );
	return {
		addTask: ( t: EditorialTask ) => setTasks( [ ...tasks, t ] ),
		editTask: ( t: EditorialTask ) =>
			setTasks( values( keyBy( [ ...tasks, t ], 'id' ) ) ),
		deleteTask: ( t: EditorialTask ) => setTasks( without( tasks, t ) ),
	};
};
