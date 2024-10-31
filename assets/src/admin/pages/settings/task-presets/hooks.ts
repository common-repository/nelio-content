/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { difference, find, isEqual, map, some } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, TaskPreset } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_PRESETS } from './store';
import { isDefined } from '@nelio-content/utils';

export const useArePresetsDirty = (): boolean =>
	useSelect( ( select ) => {
		const oldPresets = select( NC_DATA ).getTaskPresets();

		const { getTaskPreset, getTaskPresets } = select( NC_TASK_PRESETS );
		const newPresets = getTaskPresets()
			.map( getTaskPreset )
			.filter( isDefined );

		if (
			difference( map( oldPresets, 'id' ), map( newPresets, 'id' ) )
				.length
		) {
			return true;
		} //end if

		return some( newPresets, ( newPreset ) => {
			const oldPreset = find( oldPresets, { id: newPreset.id } );
			return ! isEqual( newPreset, oldPreset );
		} );
	} );

export const useIsSaving = (): boolean =>
	useSelect( ( select ) => select( NC_TASK_PRESETS ).isSavingPresets() );

export const useTaskPreset = (
	presetId: TaskPreset[ 'id' ]
): Maybe< TaskPreset > =>
	useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getTaskPreset( presetId )
	);
