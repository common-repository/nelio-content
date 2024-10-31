/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ContextualHelp, SaveButton } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_TASK_EDITOR } from './store';
import { walkthrough } from './walkthrough';

import { Assignee } from './components/assignee';
import { DateDue } from './components/date-due';
import { ErrorDetector } from './components/error-detector';
import { MaybeRelatedPost } from './components/maybe-related-post';
import { TaskColor } from './components/task-color';
import { TaskDescriptionEditor } from './components/task-description-editor';

export * from './store';

export type TaskEditorProps = {
	readonly className?: string;
};

export const TaskEditor = ( {
	className = '',
}: TaskEditorProps ): JSX.Element | null => {
	const error = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getValidationError()
	);
	const isVisible = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).isVisible()
	);
	const isSaving = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).isSaving()
	);

	const isExistingTask = useSelect(
		( select ) => ! select( NC_TASK_EDITOR ).isNewTask()
	);
	const isExistingTaskDirty = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).isDirty()
	);

	const { close, saveAndClose } = useDispatch( NC_TASK_EDITOR );

	const title = <Title />;

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<Modal
			className={ `nelio-content-task-editor ${ className }` }
			title={ title as unknown as string }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<ErrorDetector />

			<TaskDescriptionEditor disabled={ isSaving } />

			<div className="nelio-content-task-editor__options">
				<Assignee disabled={ isSaving } />
				<DateDue disabled={ isSaving } />
			</div>

			<MaybeRelatedPost disabled={ isSaving } />

			<TaskColor
				className="nelio-content-task-editor__colors"
				disabled={ isSaving }
			/>

			<div className="nelio-content-task-editor__actions">
				<Button
					variant="secondary"
					disabled={ isSaving }
					onClick={ close }
				>
					{ isExistingTaskDirty
						? _x( 'Discard Changes', 'command', 'nelio-content' )
						: _x( 'Close', 'command', 'nelio-content' ) }
				</Button>

				<SaveButton
					variant="primary"
					error={ error }
					disabled={ isExistingTask ? ! isExistingTaskDirty : false }
					isUpdate={ isExistingTask }
					isSaving={ isSaving }
					onClick={ saveAndClose }
				/>
			</div>
		</Modal>
	);
};

const Title = (): JSX.Element => {
	const isNew = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).isNewTask()
	);
	return (
		<div className="nelio-content-task-editor__title">
			<div className="nelio-content-task-editor__title-text">
				{ isNew
					? _x( 'Create Task', 'text', 'nelio-content' )
					: _x( 'Edit Task', 'text', 'nelio-content' ) }
			</div>
			<div className="nelio-content-task-editor__title-help">
				<ContextualHelp
					context="task-editor"
					walkthrough={ walkthrough }
					autostart={ true }
				/>
			</div>
		</div>
	);
};
