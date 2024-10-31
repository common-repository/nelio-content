/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { dateI18n } from '@nelio-content/date';
import { store as NC_DATA, useToday } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { usePreviewAttributes, useRecurrenceContext } from '../hooks';
import { createRecurrenceContext } from '@nelio-content/utils';

export const RecurrenceUpdater = (): null => {
	const originalDate = useOriginalDate();
	const [ _, setContext ] = useRecurrenceContext();

	useEffect( () => {
		setContext( createRecurrenceContext( originalDate ) );
	}, [ setContext, originalDate ] );

	return null;
};

// =====
// HOOKS
// =====

const useOriginalDate = () => {
	const schedule = usePreviewAttributes().schedule;
	const today = useToday();
	const timezone = useSelect( ( select ) =>
		select( NC_DATA ).getSiteTimezone()
	);
	const day = schedule ? dateI18n( 'Y-m-d', schedule, timezone ) : undefined;
	return day || today;
};
