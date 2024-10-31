/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { useRecurrenceSummary as useActualRecurrenceSummary } from '@nelio-content/data';
import type {
	RecurrenceContext,
	RecurrenceSettings,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useIsRecurringMessage = (): [
	boolean,
	( enabled: boolean ) => void,
] => {
	const isRecurring = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isRecurrenceEnabled()
	);
	const { enableRecurrence } = useDispatch( NC_SOCIAL_EDITOR );
	return [ isRecurring, enableRecurrence ];
};

export const useCanToggleRecurrence = (): boolean =>
	useSelect(
		( select ) =>
			'toggeable' === select( NC_SOCIAL_EDITOR ).getRecurrenceMode()
	);

export const useCanEditRecurrence = (): boolean =>
	useSelect(
		( select ) =>
			'locked' !== select( NC_SOCIAL_EDITOR ).getRecurrenceMode()
	);

export const useIsEditingRecurrenceSettings = (): [
	boolean,
	( editing: boolean ) => void,
] => {
	const isEditing = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isEditingRecurrenceSettings()
	);
	const { editRecurrenceSettings } = useDispatch( NC_SOCIAL_EDITOR );
	return [ isEditing, editRecurrenceSettings ];
};

export const useRecurrenceSettings = (): [
	RecurrenceSettings,
	( settings: RecurrenceSettings ) => void,
] => {
	const settings = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getRecurrenceSettings()
	);
	const { setRecurrenceSettings } = useDispatch( NC_SOCIAL_EDITOR );
	return [ settings, setRecurrenceSettings ];
};

export const useRecurrenceContext = (): [
	RecurrenceContext,
	( context: Partial< RecurrenceContext > ) => void,
] => {
	const context = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getRecurrenceContext()
	);
	const { setRecurrenceContext } = useDispatch( NC_SOCIAL_EDITOR );
	return [ context, setRecurrenceContext ];
};

export const useRecurrenceSummary = (): string => {
	const [ context ] = useRecurrenceContext();
	const [ settings ] = useRecurrenceSettings();
	return useActualRecurrenceSummary( context, settings );
};
