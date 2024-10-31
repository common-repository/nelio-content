/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { useTime } from '../../hooks';

import { ExactTimeSelector } from './exact-selector';
import { PositiveHoursSelector } from './positive-hours-selector';
import { TimeIntervalSelector } from './time-interval-selector';
import { DefaultSelector } from './default-selector';

export type TimeSelectorProps = {
	readonly disabled?: boolean;
};

export const TimeSelector = ( {
	disabled,
}: TimeSelectorProps ): JSX.Element => {
	const [ { timeType } ] = useTime();

	switch ( timeType ) {
		case 'exact':
			return <ExactTimeSelector disabled={ disabled } />;

		case 'positive-hours':
			return <PositiveHoursSelector disabled={ disabled } />;

		case 'time-interval':
			return <TimeIntervalSelector disabled={ disabled } />;

		case 'predefined-offset':
		default:
			return <DefaultSelector disabled={ disabled } />;
	} //end switch
};
