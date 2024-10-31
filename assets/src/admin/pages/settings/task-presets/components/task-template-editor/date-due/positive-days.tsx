/**
 * WordPres dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberControl } from '@nelio-content/components';
import type { TaskTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { BackButton } from './back-button';

type DateValue = TaskTemplate[ 'dateValue' ];

export type PositiveDaysProps = {
	readonly dateValue: DateValue;
	readonly disabled?: boolean;
	readonly setDateValue: ( value: DateValue ) => void;
};

export const PositiveDays = ( {
	disabled,
	dateValue,
	setDateValue,
}: PositiveDaysProps ): JSX.Element => (
	<div className="nelio-content-task-template-editor-date-due__days-offset">
		<NumberControl
			className="nelio-content-task-template-editor-date-due__days-input"
			disabled={ disabled }
			min={ 1 }
			value={ dateValue }
			onChange={ ( val ) => setDateValue( stringify( val ) ) }
		/>
		<span>{ _x( 'days after pub.', 'text', 'nelio-content' ) }</span>
		<BackButton disabled={ disabled } />
	</div>
);

// =======
// HELPERS
// =======

const stringify = ( n?: number ) => ( undefined === n ? '' : `${ n }` );
