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
import { useTime, useIsPostBasedSchedule } from '../../hooks';

export type PositiveHoursProps = {
	readonly disabled?: boolean;
};

export const PositiveHoursSelector = ( {
	disabled,
}: PositiveHoursProps ): JSX.Element => {
	const [ { timeValue }, setTimeTypeAndValue ] = useTime();
	const isBasedOnPublication = useIsPostBasedSchedule();

	return (
		<BaseControl
			id="nelio-content-social-message-editor__time-selector"
			label={ _x( 'Time', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__time-selector">
				{ createInterpolateElement( getLabel( isBasedOnPublication ), {
					input: (
						<NumberControl
							className="nelio-content-social-message-editor__positive-hours-selector"
							disabled={ disabled }
							value={ timeValue }
							min={ 2 }
							onChange={ ( value ) =>
								setTimeTypeAndValue(
									'positive-hours',
									undefined === value ? '' : `${ value }`
								)
							}
						/>
					),
				} ) }
				<ResetButton disabled={ disabled } />
			</div>
		</BaseControl>
	);
};

// =======
// HELPERS
// =======

const getLabel = ( isBasedOnPublication: boolean ) => {
	if ( isBasedOnPublication ) {
		return sprintf(
			/* translators: number of hours */
			_x( '%s hours after publication.', 'text', 'nelio-content' ),
			'<input/>'
		);
	} //end if

	return sprintf(
		/* translators: number of hours */
		_x( 'In %s hours.', 'text', 'nelio-content' ),
		'<input/>'
	);
};
