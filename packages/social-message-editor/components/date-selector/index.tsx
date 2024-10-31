/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { useDate } from '../../hooks';

import { ExactDateSelector } from './exact-selector';
import { PositiveDaysSelector } from './positive-days-selector';
import { DefaultSelector } from './default-selector';

export type DateSelectorProps = {
	readonly disabled?: boolean;
};

export const DateSelector = ( {
	disabled,
}: DateSelectorProps ): JSX.Element => {
	const [ { dateType } ] = useDate();

	switch ( dateType ) {
		case 'exact':
			return <ExactDateSelector disabled={ disabled } />;

		case 'positive-days':
			return <PositiveDaysSelector disabled={ disabled } />;

		case 'predefined-offset':
		default:
			return <DefaultSelector disabled={ disabled } />;
	} //end switch
};
