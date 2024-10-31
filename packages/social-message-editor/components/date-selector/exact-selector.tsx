/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DateInput } from '@nelio-content/components';
import { useToday } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { ResetButton } from './reset-button';
import { useDate } from '../../hooks';

export type ExactDateSelectorProps = {
	readonly disabled?: boolean;
};

export const ExactDateSelector = ( {
	disabled,
}: ExactDateSelectorProps ): JSX.Element => {
	const [ { dateValue }, setDateTypeAndValue ] = useDate();
	const today = useToday();
	return (
		<BaseControl
			id="nelio-content-social-message-editor__date-selector"
			label={ _x( 'Date', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__date-selector">
				<DateInput
					disabled={ disabled }
					value={ dateValue || '' }
					min={ today }
					onChange={ ( value ) =>
						setDateTypeAndValue( 'exact', value ?? '' )
					}
				/>
				<ResetButton disabled={ disabled } />
			</div>
		</BaseControl>
	);
};
