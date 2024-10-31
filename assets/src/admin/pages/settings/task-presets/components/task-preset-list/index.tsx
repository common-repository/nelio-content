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
import { some, trim } from 'lodash';
import { SaveButton } from '@nelio-content/components';
import { isDefined, isEmpty } from '@nelio-content/utils';
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { TaskPreset } from '../task-preset';

import {
	useArePresetsDirty,
	useIsSaving,
} from '~/nelio-content-pages/settings/task-presets/hooks';
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';

export const TaskPresetList = (): JSX.Element => {
	const presets = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getTaskPresets()
	);

	const isSaving = useIsSaving();
	const arePresetsDirty = useArePresetsDirty();
	const error = useValidationError();

	const { createTaskPreset, saveTaskPresets } =
		useDispatch( NC_TASK_PRESETS );

	return (
		<>
			<div className="nelio-content-task-preset-list">
				{ isEmpty( presets ) &&
					_x(
						'Task Presets let you define a set of Editorial Tasks that can be automatically instantiated when creating new posts in your blog.',
						'user',
						'nelio-content'
					) }
				{ presets.map( ( id, index ) => (
					<TaskPreset key={ index } presetId={ id } />
				) ) }
			</div>

			<div className="nelio-content-task-preset-list__actions">
				<SaveButton
					variant="primary"
					error={ error }
					isSaving={ isSaving }
					onClick={ saveTaskPresets }
					disabled={ ! arePresetsDirty || isSaving || !! error }
					baseLabel={ _x(
						'Save Changes',
						'command',
						'nelio-content'
					) }
				/>

				<Button
					className="nelio-content-add-task-preset"
					variant="secondary"
					onClick={ createTaskPreset }
					disabled={ isSaving }
				>
					{ _x( 'Add Task Preset', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useValidationError = (): Maybe< string > => {
	const presets = useSelect( ( select ) =>
		select( NC_TASK_PRESETS )
			.getTaskPresets()
			.map( select( NC_TASK_PRESETS ).getTaskPreset )
			.filter( isDefined )
	);

	if ( some( presets, ( p ) => ! trim( p.name ) ) ) {
		return _x( 'Please name all your presets', 'user', 'nelio-content' );
	} //end if

	if ( some( presets, ( p ) => ! p.tasks.length ) ) {
		return _x(
			'Please add one or more tasks to all your presets',
			'user',
			'nelio-content'
		);
	} //end if

	return undefined;
};
