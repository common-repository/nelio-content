/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, TextControl } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim, without } from 'lodash';
import { DeleteButton } from '@nelio-content/components';
import { replace } from '@nelio-content/utils';
import type { TaskPreset as TaskPresetType } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';
import {
	useTaskPreset,
	useIsSaving,
} from '~/nelio-content-pages/settings/task-presets/hooks';

import { TaskTemplate } from '../task-template';

export type TaskPresetProps = {
	readonly presetId: TaskPresetType[ 'id' ];
};

export const TaskPreset = ( {
	presetId,
}: TaskPresetProps ): JSX.Element | null => {
	const preset = useTaskPreset( presetId );
	const isSaving = useIsSaving();
	const {
		openTaskTemplateEditor,
		removeTaskPreset,
		setTaskPresetName,
		setTaskTemplates,
	} = useDispatch( NC_TASK_PRESETS );
	const [ isExpanded, expand ] = useState( ! preset?.tasks.length );

	if ( ! preset ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-task-preset">
			<div className="nelio-content-task-preset__header">
				<button
					disabled={ isSaving }
					onClick={ ( ev ) => {
						ev.preventDefault();
						expand( ! isExpanded );
					} }
				>
					<span>
						<strong>
							{ trim( preset.name ) ||
								_x(
									'Unnamed Task Preset',
									'text',
									'nelio-content'
								) }
						</strong>{ ' ' }
						{ sprintf(
							/* translators: number of tasks */
							_nx(
								'(%d task)',
								'(%d tasks)',
								preset.tasks.length,
								'text',
								'nelio-content'
							),
							preset.tasks.length
						) }
					</span>
					<Dashicon icon={ isExpanded ? 'arrow-up' : 'arrow-down' } />
				</button>
			</div>
			{ isExpanded && (
				<div className="nelio-content-task-preset__body">
					<div className="nelio-content-task-preset__name-and-delete">
						<TextControl
							value={ preset.name }
							onChange={ ( name ) =>
								setTaskPresetName( presetId, name )
							}
							placeholder={ _x(
								'Name your preset…',
								'user',
								'nelio-content'
							) }
						/>
						<span>
							<DeleteButton
								onClick={ () => removeTaskPreset( presetId ) }
							/>
						</span>
					</div>
					<div className="nelio-content-task-preset__tasks">
						{ preset.tasks.map( ( task, index ) => (
							<TaskTemplate
								key={ `${ index }-${ preset.tasks.length }` }
								presetId={ presetId }
								task={ task }
								onDelete={ () =>
									setTaskTemplates(
										presetId,
										without( preset.tasks, task )
									)
								}
								onUpdate={ ( newTask ) =>
									setTaskTemplates(
										presetId,
										replace( task, newTask, preset.tasks )
									)
								}
								disabled={ isSaving }
							/>
						) ) }
					</div>
					<div className="nelio-content-task-preset__actions">
						<Button
							size="small"
							variant="secondary"
							onClick={ () =>
								openTaskTemplateEditor( presetId, {
									task: '',
									assigneeId: undefined,
									color: 'none',
									dateType: 'predefined-offset',
									dateValue: '0',
								} )
							}
						>
							{ _x( 'New Task', 'command', 'nelio-content' ) }
						</Button>
					</div>
				</div>
			) }
		</div>
	);
};
