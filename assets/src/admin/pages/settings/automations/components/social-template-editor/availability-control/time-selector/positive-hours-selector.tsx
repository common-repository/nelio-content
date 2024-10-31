/**
 * WordPres dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { NumberControl } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { ResetButton } from './reset-button';

export type PositiveHoursProps = {
	readonly hours: number;
	readonly setHours: ( value: number ) => void;
	readonly reset: () => void;
};

export const PositiveHoursSelector = ( {
	hours,
	setHours,
	reset,
}: PositiveHoursProps ): JSX.Element => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__time-selector">
				{ createInterpolateElement(
					sprintf(
						/* translators: number of hours */
						_x(
							'%s hours after publication.',
							'text',
							'nelio-content'
						),
						'<input/>'
					),
					{
						input: (
							<NumberControl
								className="nelio-content-social-template-editor__positive-hours-selector"
								value={ hours }
								min={ 2 }
								max={ 24 }
								onChange={ ( value ) => setHours( value ?? 2 ) }
							/>
						),
					}
				) }
				<ResetButton onClick={ () => reset() } />
			</div>
		</BaseControl>
	);
};
