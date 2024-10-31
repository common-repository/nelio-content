/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, isUrl } from '@nelio-content/utils';
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../store';

export const ErrorDetector = (): null => {
	const { authorId, dateValue, reference, timeValue, title } = useProps();
	const { setError, clearErrors } = useError();

	useEffect(
		voidify( () => {
			if ( isEmpty( trim( title ) ) ) {
				return setError(
					_x( 'Please set post’s title', 'user', 'nelio-content' )
				);
			} //end if

			if ( isEmpty( authorId ) ) {
				return setError(
					_x( 'Please set a post author', 'user', 'nelio-content' )
				);
			} //end if

			if ( isEmpty( dateValue ) && ! isEmpty( timeValue ) ) {
				return setError(
					_x( 'Please specify a valid date', 'user', 'nelio-content' )
				);
			} //end if

			if ( ! isEmpty( dateValue ) && isEmpty( timeValue ) ) {
				return setError(
					_x( 'Please specify a valid time', 'user', 'nelio-content' )
				);
			} //end if

			if ( reference && ! isUrl( reference ) ) {
				return setError(
					_x(
						'Please type in a valid reference URL',
						'user',
						'nelio-content'
					)
				);
			} //end if

			return clearErrors();
		} ),
		[ authorId, dateValue, reference, timeValue, title ]
	);

	return null;
};

// =====
// HOOKS
// =====

const useProps = () =>
	useSelect( ( select ) => {
		const {
			getAuthorId,
			getDateValue,
			getReferenceInput,
			getTimeValue,
			getTitle,
		} = select( NC_POST_EDITOR );

		return {
			authorId: getAuthorId(),
			dateValue: getDateValue(),
			reference: getReferenceInput(),
			timeValue: getTimeValue(),
			title: getTitle(),
		};
	} );

const useError = () => {
	const { setValidationError } = useDispatch( NC_POST_EDITOR );
	return {
		setError: setValidationError,
		clearErrors: () => setValidationError( '' ),
	};
};

// =======
// HELPERS
// =======

const voidify = ( fn: () => unknown ) => () => void fn();
