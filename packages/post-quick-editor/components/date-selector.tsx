/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { DateInput } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { extractDateTimeValues } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { useIsDisabled, useIsPublished } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const DateSelector = (): JSX.Element => {
	const [ date, setDate ] = useDate();
	const minDate = useMinDate();
	const disabled = useIsDisabled();
	const published = useIsPublished();

	return (
		<div className="nelio-content-post-quick-editor__date">
			<DateInput
				disabled={ disabled || published }
				value={ date }
				onChange={ ( d ) => setDate( d ?? '' ) }
				min={ minDate }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useDate = () => {
	const dateValue = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getDateValue()
	);
	const { setDateValue } = useDispatch( NC_POST_EDITOR );
	return [ dateValue, setDateValue ] as const;
};

const useMinDate = () =>
	useSelect( ( select ) => {
		const { getToday, getPost } = select( NC_DATA );
		const { getId, isNewPost } = select( NC_POST_EDITOR );
		const today = getToday();
		const post = getPost( getId() );
		const dtv = extractDateTimeValues( post?.date );
		return isNewPost() ? today : minDate( today, dtv?.dateValue );
	} );

// =======
// HELPERS
// =======

const minDate = ( d1: string, d2?: string ) => ( ! d2 || d1 < d2 ? d1 : d2 );
