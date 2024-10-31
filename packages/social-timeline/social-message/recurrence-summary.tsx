/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import {
	store as NC_DATA,
	useRecurrenceSummary as useActualRecurrenceSummary,
} from '@nelio-content/data';
import { createRecurrenceContext } from '@nelio-content/utils';
import type { Maybe, RecurrenceSettings, Uuid } from '@nelio-content/types';

export type RecurrenceSummaryProps = {
	readonly messageId: Uuid;
};

export const RecurrenceSummary = ( {
	messageId,
}: RecurrenceSummaryProps ): JSX.Element | null => {
	const summary = useRecurrenceSummary( messageId );
	if ( ! summary ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-social-message__recurrence">
			<Dashicon icon="controls-repeat" />
			{ summary }
		</div>
	);
};

// =====
// HOOKS
// =====

const DEFAULT_SETTINGS: RecurrenceSettings = {
	period: 'day',
	occurrences: 2,
	interval: 1,
};

const useRecurrenceSummary = ( id: Uuid ): Maybe< string > => {
	const { message, today } = useSelect( ( select ) => ( {
		message: select( NC_DATA ).getSocialMessage( id ),
		today: select( NC_DATA ).getToday(),
	} ) );

	const summary = useActualRecurrenceSummary(
		createRecurrenceContext( message?.schedule || today ),
		message?.recurrenceSettings ?? DEFAULT_SETTINGS
	);
	return !! message?.recurrenceSettings ? summary : undefined;
};
