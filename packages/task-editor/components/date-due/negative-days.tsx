/**
 * WordPres dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberControl } from '@nelio-content/components';
import type { EditorialTask } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { BackButton } from './back-button';

type DateValue = EditorialTask[ 'dateValue' ];

export type NegativeDaysProps = {
	readonly dateValue: DateValue;
	readonly disabled?: boolean;
	readonly setDateValue: ( value: DateValue ) => void;
};

export const NegativeDays = ( {
	disabled,
	dateValue,
	setDateValue,
}: NegativeDaysProps ): JSX.Element => (
	<div className="nelio-content-task-editor-date-due__days-offset">
		<NumberControl
			className="nelio-content-task-editor-date-due__days-input"
			disabled={ disabled }
			placeholder={ _x(
				'Days before publication…',
				'text',
				'nelio-content'
			) }
			min={ 2 }
			value={ dateValue }
			onChange={ ( val ) => setDateValue( stringify( val ) ) }
		/>
		<BackButton disabled={ disabled } />
	</div>
);

// =======
// HELPERS
// =======

const stringify = ( n?: number ) => ( undefined === n ? '' : `${ n }` );
