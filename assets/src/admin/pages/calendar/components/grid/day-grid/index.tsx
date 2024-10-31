/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';
import { upperFirst } from 'lodash';
import { dateI18n, wpifyDateTime } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { Day } from './day';
import type { GridProps } from '../props';

export const DayGrid = ( {
	className = '',
	firstDay,
	numberOfDays,
}: GridProps ): JSX.Element => {
	const momentDay = moment( wpifyDateTime( 'c', firstDay, '12:00' ) );
	const days: string[] = [];
	for ( let i = 0; i < numberOfDays; ++i ) {
		days.push( dateI18n( 'Y-m-d', momentDay ) );
		momentDay.add( 1, 'day' );
	} //end for

	const momentWeekday = moment( wpifyDateTime( 'c', firstDay, '12:00' ) );
	const weekdays: string[] = [];
	for ( let i = 0; i < 7; ++i ) {
		weekdays.push( upperFirst( dateI18n( 'D', momentWeekday ) ) );
		momentWeekday.add( 1, 'day' );
	} //end if

	return (
		<div className={ classnames( 'nelio-content-day-grid', className ) }>
			<div className="nelio-content-day-grid__header">
				{ weekdays.map( ( weekday, index ) => (
					<div
						key={ index }
						className="nelio-content-day-grid__weekday"
					>
						{ weekday }
					</div>
				) ) }
			</div>

			{ days.map( ( day ) => (
				<Day key={ `day-${ day }` } day={ day } />
			) ) }
		</div>
	);
};
