/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { TimeInput } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { ResetButton } from './reset-button';
import { useTime } from '../../hooks';

export type ExactTimeSelectorProps = {
	readonly disabled?: boolean;
};

export const ExactTimeSelector = ( {
	disabled,
}: ExactTimeSelectorProps ): JSX.Element => {
	const [ { timeValue }, setTimeTypeAndValue ] = useTime();
	return (
		<BaseControl
			id="nelio-content-social-message-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__time-selector">
				<TimeInput
					disabled={ disabled }
					value={ timeValue }
					onChange={ ( value ) =>
						setTimeTypeAndValue( 'exact', value ?? '' )
					}
				/>
				<ResetButton disabled={ disabled } />
			</div>
		</BaseControl>
	);
};
