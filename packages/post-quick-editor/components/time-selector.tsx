/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { TimeInput } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { useIsDisabled, useIsPublished } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const TimeSelector = (): JSX.Element => {
	const [ time, setTime ] = useTime();
	const disabled = useIsDisabled();
	const published = useIsPublished();

	return (
		<div className="nelio-content-post-quick-editor__time">
			<TimeInput
				disabled={ disabled || published }
				value={ time }
				onChange={ ( t ) => setTime( t ?? '' ) }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTime = () => {
	const timeValue = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTimeValue()
	);
	const { setTimeValue } = useDispatch( NC_POST_EDITOR );
	return [ timeValue, setTimeValue ] as const;
};
