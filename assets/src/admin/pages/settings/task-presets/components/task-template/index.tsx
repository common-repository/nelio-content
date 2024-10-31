/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { sprintf, _x, _nx } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DeleteButton } from '@nelio-content/components';
import type {
	TaskPreset,
	TaskTemplate as TaskTempl,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';
import { useAuthorName } from '@nelio-content/data';

export type TaskTemplateProps = {
	readonly presetId: TaskPreset[ 'id' ];
	readonly task: TaskTempl;
	readonly disabled: boolean;
	readonly onDelete: () => void;
	readonly onUpdate: ( task: TaskTempl ) => void;
};

export const TaskTemplate = ( {
	presetId,
	task,
	onDelete,
}: TaskTemplateProps ): JSX.Element => {
	const { openTaskTemplateEditor } = useDispatch( NC_TASK_PRESETS );
	const authorName = useAuthorName( task.assigneeId );
	const dueDate = getDueDate( task.dateType, task.dateValue );
	const onEdit = () => openTaskTemplateEditor( presetId, task );
	return (
		<div
			className={
				task.color === 'none'
					? 'nelio-content-task-template'
					: `nelio-content-task-template nelio-content-task-template--is-${ task.color }`
			}
		>
			<div className="nelio-content-task-template__task">
				{ task.task }
			</div>
			<div className="nelio-content-task-template__extra">
				{ sprintf(
					'%1$s • %2$s',
					task.assigneeId
						? authorName
						: _x( 'Post Author', 'text', 'nelio-content' ),
					dueDate
				) }
			</div>
			<div className="nelio-content-task-template__actions">
				<Button variant="link" onClick={ onEdit }>
					{ _x( 'Edit', 'command', 'nelio-content' ) }
				</Button>
				<DeleteButton onClick={ onDelete } />
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

const getDueDate = (
	type: TaskTempl[ 'dateType' ],
	value: TaskTempl[ 'dateValue' ]
): string => {
	const numValue = Math.abs( Number.parseInt( value ) || 0 );
	switch ( type ) {
		case 'negative-days':
		case 'predefined-offset':
			return (
				{
					'0': _x(
						'Same day as publication',
						'text',
						'nelio-content'
					),
					'-1': _x(
						'The day before publication',
						'text',
						'nelio-content'
					),
					'-7': _x(
						'A week before publication',
						'text',
						'nelio-content'
					),
				}[ value ] ||
				sprintf(
					/* translators: number of days */
					_nx(
						'%d day before publication',
						'%d days before publication',
						numValue,
						'text',
						'nelio-content'
					),
					numValue
				)
			);

		case 'positive-days':
			return sprintf(
				/* translators: number of days */
				_nx(
					'%d day after publication',
					'%d days after publication',
					numValue,
					'text',
					'nelio-content'
				),
				numValue
			);
	} //end switch
};
