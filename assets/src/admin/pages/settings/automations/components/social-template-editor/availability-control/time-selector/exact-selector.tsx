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
import type { ExactTime } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { ResetButton } from './reset-button';

export type ExactTimeSelectorProps = {
	readonly exactTime: ExactTime;
	readonly setExactTime: ( value: ExactTime ) => void;
	readonly reset: () => void;
};

export const ExactTimeSelector = ( {
	exactTime,
	setExactTime,
	reset,
}: ExactTimeSelectorProps ): JSX.Element => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__time-selector">
				<TimeInput
					value={ exactTime }
					onChange={ ( value ) =>
						value ? setExactTime( value as ExactTime ) : null
					}
				/>
				<ResetButton onClick={ () => reset() } />
			</div>
		</BaseControl>
	);
};
