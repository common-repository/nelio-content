/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';
import { upperFirst } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { dateI18n } from '@nelio-content/date';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export type PeriodLabelProps = {
	readonly isBlurred?: boolean;
};

export const PeriodLabel = ( {
	isBlurred,
}: PeriodLabelProps ): JSX.Element | null => {
	const firstDayOfWeek = useSelect( ( select ) =>
		select( NC_DATA ).getFirstDayOfWeek()
	);
	const calendarMode = useSelect( ( select ) =>
		select( NC_CALENDAR ).getCalendarMode()
	);
	const firstDay = useSelect( ( select ) =>
		select( NC_CALENDAR ).getFirstDay( firstDayOfWeek )
	);
	const lastDay = useSelect( ( select ) =>
		select( NC_CALENDAR ).getLastDay( firstDayOfWeek )
	);

	if ( ! firstDay ) {
		return null;
	} //end if

	if ( 'month' === calendarMode ) {
		const dayInMonth = moment( firstDay ).add( 15, 'days' );
		const month = upperFirst( dateI18n( 'F', dayInMonth ) );
		const year = dateI18n( 'Y', dayInMonth );
		return (
			<h2 className="nelio-content-period-label">
				{ month } { year }
			</h2>
		);
	} //end if

	const longFirstMonth = upperFirst( dateI18n( 'F', firstDay ) );
	const longLastMonth = upperFirst( dateI18n( 'F', lastDay ) );

	const firstYear = dateI18n( 'Y', firstDay );
	const lastYear = dateI18n( 'Y', lastDay );

	if ( longFirstMonth === longLastMonth && firstYear === lastYear ) {
		return (
			<h2
				className={ classnames( {
					'nelio-content-period-label': true,
					'nelio-content-period-label--is-blurred': isBlurred,
				} ) }
			>
				{ longFirstMonth } { firstYear }
			</h2>
		);
	} //end if

	const shortFirstMonth = upperFirst( dateI18n( 'M', firstDay ) );
	const shortLastMonth = upperFirst( dateI18n( 'M', lastDay ) );

	if ( firstYear === lastYear ) {
		return (
			<h2
				className={ classnames( {
					'nelio-content-period-label': true,
					'nelio-content-period-label--is-blurred': isBlurred,
				} ) }
			>
				{ sprintf(
					/* translators: 1 -> month, 2 -> month, 3 -> year */
					_x( '%1$s – %2$s %3$s', 'text (M-M Y)', 'nelio-content' ),
					shortFirstMonth,
					shortLastMonth,
					firstYear
				) }
			</h2>
		);
	} //end if

	return (
		<h2
			className={ classnames( {
				'nelio-content-period-label': true,
				'nelio-content-period-label--is-blurred': isBlurred,
			} ) }
		>
			{ sprintf(
				/* translators: 1 -> month, 2 -> year, 3 -> month, 4 -> year */
				_x(
					'%1$s %2$s – %3$s %4$s',
					'text (M Y-M Y)',
					'nelio-content'
				),
				shortFirstMonth,
				firstYear,
				shortLastMonth,
				lastYear
			) }
		</h2>
	);
};
