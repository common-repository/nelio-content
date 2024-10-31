/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextareaControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../store';

export type TaskDescriptionEditorProps = {
	readonly disabled?: boolean;
};

export const TaskDescriptionEditor = ( {
	disabled,
}: TaskDescriptionEditorProps ): JSX.Element => {
	const [ task, setTask ] = useTask();
	return (
		<div className="nelio-content-task-editor__actual-task">
			<TextareaControl
				disabled={ disabled }
				value={ task }
				onChange={ ( value ) => setTask( value ) }
				placeholder={ _x(
					'Describe the task…',
					'user',
					'nelio-content'
				) }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTask = () => {
	const task = useSelect( ( select ) => select( NC_TASK_EDITOR ).getTask() );
	const { setTask } = useDispatch( NC_TASK_EDITOR );
	return [ task, setTask ] as const;
};
