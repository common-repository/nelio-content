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
	<div className="nelio-content-task-editor-date-due__days-offset">
		<NumberControl
			className="nelio-content-task-editor-date-due__days-input"
			disabled={ disabled }
			placeholder={ _x(
				'Days after publication…',
				'text',
				'nelio-content'
			) }
			min={ 1 }
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
