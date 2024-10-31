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
import { TypeIcon } from './type-icon';

export type InternalEventProps = {
	readonly className?: string;
	readonly itemId: Uuid;
	readonly isClickable: boolean;
};

export const InternalEvent = ( {
	className,
	itemId,
	isClickable,
}: InternalEventProps ): JSX.Element | null => {
	const event = useInternalEvent( itemId );
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

	const { date, color, backgroundColor, editLink, isDayEvent, title, type } =
		event;

	const onClick = () => {
		if ( isClickable && editLink ) {
			window.location.href = editLink;
		} //end if
	};

	const isPastEvent = isDayEvent ? date < today : isPastDatetime( date );
	return (
		<div
			role={ type }
			className={ classnames(
				'nelio-content-calendar-internal-event',
				className,
				isDayEvent &&
					'nelio-content-calendar-internal-event--is-day-event',
				isPastEvent &&
					'nelio-content-calendar-internal-event--is-past-event'
			) }
			style={ { color, backgroundColor, borderColor: backgroundColor } }
			onClick={ onClick }
			onKeyUp={ ( e ) => {
				if ( e.key === 'Enter' ) {
					onClick();
				} //end if
			} }
		>
			<TypeIcon
				className="nelio-content-calendar-internal-event__type-icon"
				type={ type }
			/>{ ' ' }
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

const useInternalEvent = ( id: Uuid ) =>
	useSelect( ( select ) => select( NC_DATA ).getInternalEvent( id ) );
