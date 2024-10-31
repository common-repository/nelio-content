/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { useTime } from '../../../hooks';

import { ExactTimeSelector } from '../../time-selector/exact-selector';
import { TimeIntervalSelector } from '../../time-selector/time-interval-selector';

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

		case 'time-interval':
		default:
			return <TimeIntervalSelector disabled={ disabled } />;
	} //end switch
};
