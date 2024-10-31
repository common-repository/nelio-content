/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';
import { upperFirst, without } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { dateI18n, wpifyDateTime } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { Segment } from './agenda-segment';
import type { GridProps } from '../props';

type PartialDay = {
	readonly id: string;
	readonly day: string;
	readonly startHour: number;
};

export const AgendaGrid = ( {
	className = '',
	firstDay,
	numberOfDays,
}: GridProps ): JSX.Element => {
	const [ segmentsHoveredByTask, setSegmentsHoveredByTask ] = useState<
		ReadonlyArray< string >
	>( [] );
	const dayHoveredByTask =
		0 < segmentsHoveredByTask.length
			? segmentsHoveredByTask[ 0 ]?.substring( 0, 10 ) ?? ''
			: '';

	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );

	const momentDay = moment( wpifyDateTime( 'c', firstDay, '12:00' ) );
	const days: string[] = [];
	for ( let i = 0; i < numberOfDays; ++i ) {
		days.push( dateI18n( 'Y-m-d', momentDay ) );
		momentDay.add( 1, 'day' );
	} //end for

	const momentWeekday = moment( wpifyDateTime( 'c', firstDay, '12:00' ) );
	const weekdays: string[] = [];
	for ( let i = 0; i < numberOfDays; ++i ) {
		weekdays.push( upperFirst( dateI18n( 'D', momentWeekday ) ) );
		momentWeekday.add( 1, 'day' );
	} //end for

	const dayHours = [ 0, 4, 8, 12, 16, 20 ];
	const partialDays: PartialDay[] = dayHours.flatMap( ( startHour ) =>
		days.map( ( day ) => ( {
			id: `${ day }:${ startHour }`,
			day,
			startHour,
		} ) )
	);

	return (
		<div
			className={ classnames(
				'nelio-content-agenda-grid',
				`nelio-content-agenda-grid--has-${ numberOfDays }-days`,
				className
			) }
		>
			{ weekdays.map( ( weekday, index ) => {
				const currentDay = days[ index ] ?? '';

				return (
					<div
						key={ index }
						className={ `nelio-content-agenda-grid__weekday nelio-content-agenda-grid__weekday--is-${ getDayType(
							today,
							currentDay
						) }` }
					>
						<div>
							{ weekday }{ ' ' }
							{ currentDay.substring( 8 ).replace( /^0/, '' ) }
						</div>
					</div>
				);
			} ) }

			{ partialDays.map( ( segment ) => (
				<Segment
					key={ segment.id }
					day={ segment.day }
					hour={ segment.startHour }
					isHoveredByTask={ segment.day === dayHoveredByTask }
					onHoveredByTask={ ( hovered ) =>
						hovered
							? setSegmentsHoveredByTask( [
									...segmentsHoveredByTask,
									segment.id,
							  ] )
							: setSegmentsHoveredByTask(
									without( segmentsHoveredByTask, segment.id )
							  )
					}
				/>
			) ) }
		</div>
	);
};

// =======
// HELPERS
// =======

function getDayType( today: string, currentDay: string ) {
	if ( currentDay < today ) {
		return 'past-day';
	} //end if
	if ( currentDay === today ) {
		return 'today';
	} //end if
	return 'future-day';
}
