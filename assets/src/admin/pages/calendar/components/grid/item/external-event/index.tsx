/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import { format } from '@nelio-content/date';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ExternalEventProps = {
	readonly className?: string;
	readonly itemId: Uuid;
};

export const ExternalEvent = ( {
	className,
	itemId,
}: ExternalEventProps ): JSX.Element | null => {
	const event = useExternalEvent( itemId );
	const today = useToday();
	const isPastDatetime = usePastDatetimeChecker();
	const eventTime = useSelect(
		( select ) =>
			!! event &&
			! event.isDayEvent &&
			select( NC_CALENDAR ).formatCalendarTime( event.date )
	);

	if ( ! event ) {
		return null;
	} //end if

	const { date, title, isDayEvent } = event;
	const isPastEvent = isDayEvent ? date < today : isPastDatetime( date );
	return (
		<div
			className={ classnames(
				'nelio-content-calendar-external-event',
				className,
				isDayEvent &&
					'nelio-content-calendar-external-event--is-day-event',
				isPastEvent &&
					'nelio-content-calendar-external-event--is-past-event'
			) }
		>
			{ !! eventTime && <strong>{ eventTime } </strong> }
			<span>{ title }</span>
		</div>
	);
};

// =====
// HOOKS
// =====

const useToday = () => useSelect( ( select ) => select( NC_DATA ).getToday() );

const usePastDatetimeChecker = () =>
	useSelect( ( select ) => {
		const now = select( NC_DATA ).getUtcNow();
		const f = 'Y-m-d H:m';
		return ( date: string ) => format( f, date ) < format( f, now );
	} );

const useExternalEvent = ( id: Uuid ) =>
	useSelect( ( select ) => select( NC_DATA ).getExternalEvent( id ) );
