/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';

import { DefaultSelector } from './default-selector';
import { NegativeDays } from './negative-days';
import { PositiveDays } from './positive-days';

import { useDateType, useDateValue } from './hooks';

export type DateDueProps = {
	readonly disabled?: boolean;
};

export const DateDue = ( { disabled }: DateDueProps ): JSX.Element => {
	const [ dateType, setDateType ] = useDateType();
	const [ dateValue, setDateValue ] = useDateValue();

	const className =
		'nelio-content-task-template-editor-date-due nelio-content-task-template-editor__date-due';

	if ( 'negative-days' === dateType ) {
		return (
			<div className={ className }>
				<NegativeDays
					disabled={ disabled }
					dateValue={ dateValue }
					setDateValue={ setDateValue }
				/>
			</div>
		);
	} //end if

	if ( 'positive-days' === dateType ) {
		return (
			<div className={ className }>
				<PositiveDays
					disabled={ disabled }
					dateValue={ dateValue }
					setDateValue={ setDateValue }
				/>
			</div>
		);
	} //end if

	return (
		<div className={ className }>
			<DefaultSelector
				disabled={ disabled }
				dateValue={ dateValue }
				setDateValue={ setDateValue }
				setDateType={ setDateType }
			/>
		</div>
	);
};
