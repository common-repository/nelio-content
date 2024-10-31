/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { DateInput } from '@nelio-content/components';
import type { EditorialTask } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { BackButton } from './back-button';

type DateValue = EditorialTask[ 'dateValue' ];

export type ExactDateProps = {
	readonly dateValue: DateValue;
	readonly disabled?: boolean;
	readonly hasBackButton?: boolean;
	readonly setDateValue: ( value: DateValue ) => void;
};

export const ExactDate = ( {
	disabled,
	dateValue,
	hasBackButton,
	setDateValue,
}: ExactDateProps ): JSX.Element => (
	<div className="nelio-content-task-editor-date-due__exact-date">
		<DateInput
			className="nelio-content-task-editor-date-due__exact-date-input"
			disabled={ disabled }
			value={ dateValue }
			onChange={ ( value ) => setDateValue( value ?? '' ) }
		/>
		{ !! hasBackButton && <BackButton disabled={ disabled } /> }
	</div>
);
