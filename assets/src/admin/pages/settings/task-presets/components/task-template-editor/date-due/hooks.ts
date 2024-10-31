/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { TaskTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';

export const useDateType = (): [
	TaskTemplate[ 'dateType' ],
	( dateType: TaskTemplate[ 'dateType' ] ) => void,
] => {
	const attrs = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTask()
	);
	const { editTaskTemplate } = useDispatch( NC_TASK_PRESETS );
	const setDateType = ( dateType: TaskTemplate[ 'dateType' ] ) =>
		editTaskTemplate( { dateType } );
	return [ attrs.dateType, setDateType ];
};

export const useDateValue = (): [
	TaskTemplate[ 'dateValue' ],
	( dateValue: TaskTemplate[ 'dateValue' ] ) => void,
] => {
	const attrs = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTask()
	);
	const { editTaskTemplate } = useDispatch( NC_TASK_PRESETS );
	const setDateValue = ( dateValue: TaskTemplate[ 'dateValue' ] ) =>
		editTaskTemplate( { dateValue } );
	return [ attrs.dateValue, setDateValue ];
};
