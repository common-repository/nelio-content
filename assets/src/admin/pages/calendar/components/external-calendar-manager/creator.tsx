/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export const Creator = (): JSX.Element => {
	const [ url, isSaving ] = useSelect(
		( select ) =>
			[
				select( NC_CALENDAR ).getEditingExternalCalendarUrl(),
				select( NC_CALENDAR ).isSavingAnExternalCalendar(),
			] as const
	);

	const { setEditingExternalCalendarUrl } = useDispatch( NC_CALENDAR );

	return (
		<>
			<TextControl
				className="nelio-content-new-external-calendar-form__input-text"
				value={ url }
				onChange={ setEditingExternalCalendarUrl }
				disabled={ isSaving }
				placeholder={ _x(
					'Write the URL of an ical calendar…',
					'user',
					'nelio-content'
				) }
			/>
		</>
	);
};
