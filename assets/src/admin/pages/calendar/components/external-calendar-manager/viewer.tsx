/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { DeleteButton } from '@nelio-content/components';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export const Viewer = (): JSX.Element => {
	const calendars = useSelect( ( select ) =>
		select( NC_CALENDAR ).getExternalCalendars()
	);

	if ( isEmpty( calendars ) ) {
		return (
			<>
				{ _x(
					'Add your first external calendar and look at its events using Nelio’s Editorial Calendar.',
					'user',
					'nelio-content'
				) }{ ' ' }
			</>
		);
	} //end if

	return (
		<>
			{ calendars.map( ( { url } ) => (
				<Calendar key={ url } url={ url } />
			) ) }
		</>
	);
};

// ============
// HELPER VIEWS
// ============

const Calendar = ( { url }: { url: Url } ) => {
	const isAdding = useSelect( ( select ) =>
		select( NC_CALENDAR ).isAddingAnExternalCalendar()
	);
	const isDeleting = useSelect( ( select ) =>
		select( NC_CALENDAR ).isDeletingExternalCalendar( url )
	);
	const calendar = useSelect( ( select ) =>
		select( NC_CALENDAR ).getExternalCalendar( url )
	);
	const name = calendar?.name ?? '';

	const { openExternalCalendarEditor, deleteExternalCalendar } =
		useDispatch( NC_CALENDAR );

	return (
		<div
			className={ classnames( {
				'nelio-content-external-calendar-manager__item': true,
				'nelio-content-external-calendar-manager__item--is-deleting':
					isDeleting,
			} ) }
		>
			<div className="nelio-content-external-calendar-manager__item-name">
				{ name }
			</div>

			<div className="nelio-content-external-calendar-manager__item-url">
				{ isDeleting ? (
					<span>{ url }</span>
				) : (
					<ExternalLink href={ url }>{ url }</ExternalLink>
				) }
			</div>

			{ isDeleting ? (
				<div className="nelio-content-external-calendar-manager__item-feedback">
					<DeleteButton
						isDeleting={ true }
						onClick={ () => void null }
					/>
				</div>
			) : (
				<div className="nelio-content-external-calendar-manager__item-actions">
					<Button
						variant="link"
						disabled={ isAdding }
						onClick={ () =>
							openExternalCalendarEditor( { url, name } )
						}
					>
						{ _x( 'Edit', 'command', 'nelio-content' ) }
					</Button>
					{ ' | ' }
					<DeleteButton
						disabled={ isAdding }
						onClick={ () => deleteExternalCalendar( url ) }
					/>
				</div>
			) }
		</div>
	);
};
