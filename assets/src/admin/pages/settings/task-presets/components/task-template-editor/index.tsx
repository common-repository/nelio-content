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
import { padStart, sortBy, trim } from 'lodash';
import { SaveButton } from '@nelio-content/components';
import { replaceOrAppend } from '@nelio-content/utils';
import type { TaskTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';

import { Assignee } from './assignee';
import { DateDue } from './date-due';
import { TaskColor } from './task-color';
import { TaskDescriptionEditor } from './task-description-editor';

export const TaskTemplateEditor = (): JSX.Element | null => {
	const context = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTaskSource()
	);

	const attrs = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTask()
	);
	const preset = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getTaskPreset( context?.presetId )
	);

	const isExistingTask = ! useIsNew();
	const isVisible = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).isTaskTemplateEditorOpen()
	);

	const error = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTaskError()
	);
	const isExistingTaskDirty = useSelect( ( select ) => {
		const { isEditingTaskDirty } = select( NC_TASK_PRESETS );
		return isExistingTask && isEditingTaskDirty();
	} );

	const { closeTaskTemplateEditor: close, setTaskTemplates } =
		useDispatch( NC_TASK_PRESETS );

	const saveAndClose = () => {
		if ( context && preset ) {
			const task = {
				...attrs,
				task: trim( attrs.task ),
			};
			void setTaskTemplates(
				preset.id,
				sortBy(
					replaceOrAppend( context.source, task, preset.tasks ),
					getSortingString
				)
			);
		} //end if
		void close();
	};

	const title = <Title />;

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<Modal
			className="nelio-content-task-template-editor"
			title={ title as unknown as string }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<TaskDescriptionEditor />

			<div className="nelio-content-task-template-editor__options">
				<Assignee />
				<DateDue />
			</div>

			<div className="nelio-content-task-template-editor__footer">
				<TaskColor className="nelio-content-task-template-editor__colors" />

				<div className="nelio-content-task-template-editor__actions">
					<Button variant="secondary" onClick={ close }>
						{ isExistingTaskDirty
							? _x(
									'Discard Changes',
									'command',
									'nelio-content'
							  )
							: _x( 'Close', 'command', 'nelio-content' ) }
					</Button>

					<SaveButton
						variant="primary"
						error={ error }
						disabled={
							isExistingTask ? ! isExistingTaskDirty : false
						}
						isUpdate={ isExistingTask }
						onClick={ saveAndClose }
					/>
				</div>
			</div>
		</Modal>
	);
};

// =============
// HELPERS VIEWS
// =============

const Title = (): JSX.Element => {
	const isNew = useIsNew();
	return (
		<div className="nelio-content-task-template-editor__title">
			<div className="nelio-content-task-template-editor__title-text">
				{ isNew
					? _x( 'Create Task', 'text', 'nelio-content' )
					: _x( 'Edit Task', 'text', 'nelio-content' ) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsNew = () =>
	useSelect( ( select ) => {
		const context = select( NC_TASK_PRESETS ).getEditingTaskSource();
		if ( ! context ) {
			return false;
		} //end if

		const preset = select( NC_TASK_PRESETS ).getTaskPreset(
			context.presetId
		);
		return ! preset?.tasks.includes( context.source );
	} );

// =======
// HELPERS
// =======

const getSortingString = ( t: TaskTemplate ): string => {
	let result = '';

	const dateValue = Math.abs( Number.parseInt( t.dateValue ) || 0 );
	if ( 0 === dateValue ) {
		result += '1';
		result += padStart( '0', 5, '0' );
	} else if ( t.dateType === 'positive-days' ) {
		result += '2';
		result += padStart( `${ dateValue }`, 5, '0' );
	} else {
		result += '0';
		result += padStart( `${ 99999 - dateValue }`, 5, '9' );
	} //end if

	result += t.task;

	return result;
};
