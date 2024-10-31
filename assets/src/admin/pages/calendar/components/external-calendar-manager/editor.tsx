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

export const Editor = (): JSX.Element => {
	const [ name, isSaving ] = useSelect(
		( select ) =>
			[
				select( NC_CALENDAR ).getEditingExternalCalendarName(),
				select( NC_CALENDAR ).isSavingAnExternalCalendar(),
			] as const
	);

	const { setEditingExternalCalendarName } = useDispatch( NC_CALENDAR );

	return (
		<>
			<TextControl
				required
				label={ _x( 'Name', 'text', 'nelio-content' ) }
				disabled={ isSaving }
				value={ name }
				onChange={ setEditingExternalCalendarName }
				placeholder={ _x(
					'Name this calendar…',
					'user',
					'nelio-content'
				) }
			/>
		</>
	);
};
