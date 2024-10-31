/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl, Dashicon } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { DeleteButton } from '@nelio-content/components';
import { useAuthorName, store as NC_DATA } from '@nelio-content/data';
import { store as NC_TASK_EDITOR } from '@nelio-content/task-editor';
import { getTaskDateDue, getHumanDateDue } from '@nelio-content/utils';
import type { EditorialTask, Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export type TaskProps = {
	readonly taskId: Uuid;
};

export const Task = ( { taskId }: TaskProps ): JSX.Element => {
	const task = useTask( taskId );
	const { canCompleteTask, canDeleteTask, canEditTask } =
		usePermissions( taskId );
	const { isDeleting, isSynching, isPastDateDue } = useStatus( taskId );

	const { completed, color = '', task: description } = task || {};

	const editTask = useTaskEditor( task );
	const deleteTask = useTaskDeleter( taskId );
	const toggleTaskCompletion = useTaskToggler( taskId );

	const assignee = useAuthorName(
		task?.assigneeId,
		_x( 'Unknown Assignee', 'text', 'nelio-content' )
	);
	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );
	const humanDateDue = task
		? getHumanDateDue( post, task.dateType, task.dateValue )
		: '';

	return (
		<div
			className={ classnames( {
				'nelio-content-editorial-task': true,
				[ `nelio-content-editorial-task--is-${ color }` ]: !! color,
				[ `nelio-content-editorial-task--is-task-${ taskId }` ]: true,
				'nelio-content-editorial-task--is-due': isPastDateDue,
			} ) }
		>
			<CheckboxControl
				className={ classnames( {
					'nelio-content-editorial-task__control': true,
					'nelio-content-editorial-task__control--is-completed':
						completed,
				} ) }
				label={ description }
				onChange={ toggleTaskCompletion }
				checked={ completed }
				disabled={ ! canCompleteTask || isDeleting || isSynching }
			/>
			<div
				className={ classnames( {
					'nelio-content-editorial-task__extra': true,
					'nelio-content-editorial-task__extra--is-completed':
						completed,
					'nelio-content-editorial-task__extra--is-deleting':
						isDeleting,
					'nelio-content-editorial-task__extra--is-due':
						isPastDateDue,
					'nelio-content-editorial-task__extra--is-synching':
						isSynching,
				} ) }
			>
				{ isSynching && _x( 'Saving…', 'text', 'nelio-content' ) }
				{ ! isSynching && `${ assignee } • ${ humanDateDue }` }
				{ isPastDateDue && <Dashicon icon="warning" /> }
			</div>

			<div
				className={ classnames( {
					'nelio-content-editorial-task__actions': true,
					'nelio-content-editorial-task__actions--is-deleting':
						isDeleting,
					'nelio-content-editorial-task__actions--is-synching':
						isSynching,
				} ) }
			>
				<Button
					variant="link"
					disabled={ ! canEditTask || isDeleting || isSynching }
					onClick={ editTask }
				>
					{ _x( 'Edit', 'command', 'nelio-content' ) }
				</Button>
				<DeleteButton
					disabled={ ! canDeleteTask || isSynching }
					isDeleting={ isDeleting }
					onClick={ deleteTask }
				/>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTask = ( taskId: Uuid ) =>
	useSelect( ( select ) => select( NC_DATA ).getTask( taskId ) );

const usePermissions = ( taskId: Uuid ) => {
	const task = useTask( taskId );
	return useSelect( ( select ) => {
		const canEditTask = select( NC_DATA ).canCurrentUserEditTask( task );
		const canDeleteTask =
			select( NC_DATA ).canCurrentUserDeleteTask( task );

		return {
			canCompleteTask: !! task && canEditTask,
			canDeleteTask: !! task && canDeleteTask,
			canEditTask: !! task && canEditTask,
		};
	} );
};

const useStatus = ( taskId: Uuid ) => {
	const task = useTask( taskId );
	return useSelect( ( select ) => {
		if ( ! task ) {
			return {
				isDeleting: false,
				isSynching: false,
				isPastDateDue: false,
			};
		} //end if

		const { isEditorialTaskBeingDeleted, isEditorialTaskBeingSynched } =
			select( NC_EDIT_POST );

		const post = select( NC_EDIT_POST ).getPost();
		const today = select( NC_DATA ).getToday();

		const isDeleting = isEditorialTaskBeingDeleted( taskId );
		const isSynching = isEditorialTaskBeingSynched( taskId );
		const isPastDateDue =
			! task.completed &&
			! isSynching &&
			getTaskDateDue( {
				baseDatetime: post?.date || undefined,
				dateType: task.dateType,
				dateValue: task.dateValue,
			} ) < today;

		return { isDeleting, isSynching, isPastDateDue };
	} );
};

const useTaskEditor = ( task: Maybe< EditorialTask > ) => {
	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );
	const { openExistingTaskEditor } = useDispatch( NC_TASK_EDITOR );
	return () =>
		!! post &&
		!! task &&
		openExistingTaskEditor( task, {
			context: 'post',
			post,
		} );
};

const useTaskDeleter = ( taskId: Uuid ) => {
	const { deleteEditorialTask } = useDispatch( NC_EDIT_POST );
	return () => deleteEditorialTask( taskId );
};

const useTaskToggler = ( taskId: Uuid ) => {
	const task = useTask( taskId );
	const { markTaskAsCompleted } = useDispatch( NC_EDIT_POST );
	return () => markTaskAsCompleted( taskId, ! task?.completed );
};
