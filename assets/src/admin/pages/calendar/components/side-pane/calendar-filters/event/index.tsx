/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim, without } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import {
	MAILPOET_NEWSLETTER,
	NELIO_AB_TESTING,
	THE_EVENTS_CAL,
} from '@nelio-content/utils';
import type { InternalEventType, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export const EventFilter = (): JSX.Element => {
	const disabledUrls = useSelect( ( select ) =>
		select( NC_CALENDAR ).getDisabledExternalCalendars()
	);
	const externalCalendars = useSelect( ( select ) =>
		select( NC_CALENDAR ).getExternalCalendars()
	);
	const disabledEventTypes = useSelect( ( select ) =>
		select( NC_CALENDAR ).getDisabledInternalEventTypes()
	);
	const internalEventTypes = useInternalEventTypes();

	const {
		manageExternalCalendars,
		setDisabledInternalEventTypes,
		setDisabledExternalCalendars,
	} = useDispatch( NC_CALENDAR );

	const toggleCalendar = ( url: Url ) =>
		setDisabledExternalCalendars(
			disabledUrls.includes( url )
				? without( disabledUrls, url )
				: [ ...disabledUrls, url ]
		);

	const toggleEventType = ( type: InternalEventType ) =>
		setDisabledInternalEventTypes(
			disabledEventTypes.includes( type )
				? without( disabledEventTypes, type )
				: [ ...disabledEventTypes, type ]
		);

	return (
		<>
			<div className="nelio-content-external-event-filters">
				<p className="nelio-content-external-event-filters__title">
					{ _x( 'External Calendars', 'text', 'nelio-content' ) }
				</p>
				{ externalCalendars.map( ( { name, url } ) => (
					<CheckboxControl
						key={ url }
						label={ trim( name ) || getName( url ) }
						checked={ ! disabledUrls.includes( url ) }
						onChange={ () => toggleCalendar( url ) }
					/>
				) ) }
				<div className="nelio-content-external-event-filters__actions">
					<Button
						variant="link"
						onClick={ () => manageExternalCalendars( true ) }
					>
						{ _x( 'Manage Calendars', 'command', 'nelio-content' ) }
					</Button>
				</div>
			</div>

			{ !! internalEventTypes.length && (
				<div className="nelio-content-internal-event-filters">
					<p className="nelio-content-internal-event-filters__title">
						{ _x( 'Events from Plugins', 'text', 'nelio-content' ) }
					</p>
					{ internalEventTypes.map( ( { type, label } ) => (
						<CheckboxControl
							key={ type }
							label={ trim( label ) }
							checked={ ! disabledEventTypes.includes( type ) }
							onChange={ () => toggleEventType( type ) }
						/>
					) ) }
				</div>
			) }
		</>
	);
};

const getName = ( url = '' ) =>
	url.replace( /^https?:\/\//, '' ).replace( /\/.*$/, '' );

// =====
// HOOKS
// =====

type IVTs = ReadonlyArray< {
	readonly type: InternalEventType;
	readonly label: string;
} >;

const useInternalEventTypes = (): IVTs => {
	const activePlugins = useSelect( ( select ) =>
		select( NC_DATA ).getActivePlugins()
	);

	return activePlugins.reduce( ( acc, plugin ): IVTs => {
		switch ( plugin ) {
			case 'mailpoet/mailpoet':
				return [
					...acc,
					{
						type: MAILPOET_NEWSLETTER,
						label: _x(
							'MailPoet Newsletters',
							'text',
							'nelio-content'
						),
					},
				];
			case 'the-events-calendar/the-events-calendar':
				return [
					...acc,
					{
						type: THE_EVENTS_CAL,
						label: _x(
							'The Events Calendar',
							'text',
							'nelio-content'
						),
					},
				];
			case 'nelio-ab-testing/nelio-ab-testing':
				return [
					...acc,
					{
						type: NELIO_AB_TESTING,
						label: _x(
							'Nelio A/B Testing',
							'text',
							'nelio-content'
						),
					},
				];
			default:
				return acc;
		}
	}, [] as IVTs );
};
