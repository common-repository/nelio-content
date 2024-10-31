/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_TASK_EDITOR } from '@nelio-content/task-editor';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const TaskCreator = (): JSX.Element => {
	const hasPresets = useHasPresets();
	const canCreateTasks = useCanCreateTasks();
	const { openTaskPresetLoader } = useDispatch( NC_EDIT_POST );
	const createTask = useTaskCreator();
	return (
		<div className="nelio-content-task-actions">
			{ hasPresets && (
				<Button
					variant="secondary"
					disabled={ ! canCreateTasks }
					onClick={ () => openTaskPresetLoader( true ) }
				>
					{ _x( 'Load Tasks', 'command', 'nelio-content' ) }
				</Button>
			) }
			<Button
				variant="secondary"
				disabled={ ! canCreateTasks }
				onClick={ createTask }
			>
				{ _x( 'Add Task', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePost = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );

const useCanCreateTasks = () => {
	const post = usePost();
	return useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreateTasksRelatedToPost( post )
	);
};

const useHasPresets = () =>
	useSelect( ( select ) => !! select( NC_DATA ).getTaskPresets().length );

const useTaskCreator = () => {
	const post = usePost();
	const { openNewTaskEditor } = useDispatch( NC_TASK_EDITOR );
	return () =>
		openNewTaskEditor(
			{
				dateType:
					'publish' !== post.status ? 'predefined-offset' : undefined,
				dateValue: 'publish' !== post.status ? '0' : undefined,
			},
			{ post, context: 'post' }
		);
};
