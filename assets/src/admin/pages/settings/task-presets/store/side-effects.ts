/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isDefined, showErrorNotice } from '@nelio-content/utils';
import type { TaskPreset } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_PRESETS } from '../store';

export async function saveTaskPresets(): Promise< void > {
	await dispatch( NC_TASK_PRESETS ).markAsSaving( true );
	const { getTaskPreset, getTaskPresets } = select( NC_TASK_PRESETS );
	const presets = getTaskPresets().map( getTaskPreset ).filter( isDefined );
	try {
		const result = await apiFetch< ReadonlyArray< TaskPreset > >( {
			path: '/nelio-content/v1/task-presets',
			method: 'POST',
			data: { presets },
		} );
		await dispatch( NC_DATA ).resetTaskPresets( result );
		await dispatch( NC_TASK_PRESETS ).resetTaskPresets( result );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
	await dispatch( NC_TASK_PRESETS ).markAsSaving( false );
} //end saveTemplate()
