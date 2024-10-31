/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../store';

export const ErrorDetector = (): null => {
	const assigneeId = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getAssigneeId()
	);
	const dateType = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getDateType()
	);
	const dateValue = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getDateValue()
	);
	const task = useSelect( ( select ) => select( NC_TASK_EDITOR ).getTask() );

	const { setValidationError: setError } = useDispatch( NC_TASK_EDITOR );
	const clearErrors = () => setError( '' );

	useEffect(
		voidify( () => {
			if ( ! trim( task ) ) {
				return setError(
					_x( 'Please enter a task', 'user', 'nelio-content' )
				);
			} //end if

			if ( ! assigneeId ) {
				return setError(
					_x(
						'Please assign the task to someone',
						'user',
						'nelio-content'
					)
				);
			} //end if

			if ( ! dateValue ) {
				return setError(
					_x( 'Please specify a date', 'user', 'nelio-content' )
				);
			} //end if

			return clearErrors();
		} ),
		[ assigneeId, dateType, dateValue, task ]
	);

	return null;
};

// =======
// HELPERS
// =======

const voidify = ( fn: () => unknown ) => () => void fn();
