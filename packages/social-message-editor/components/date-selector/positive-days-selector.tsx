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
import { useDate, useIsPostBasedSchedule } from '../../hooks';

export type PositiveDaysSelectorProps = {
	readonly disabled?: boolean;
};

export const PositiveDaysSelector = ( {
	disabled,
}: PositiveDaysSelectorProps ): JSX.Element => {
	const [ { dateValue }, setDateTypeAndValue ] = useDate();
	const isBasedOnPublication = useIsPostBasedSchedule();

	return (
		<BaseControl
			id="nelio-content-social-message-editor__date-selector"
			label={ _x( 'Date', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-message-editor__date-selector">
				{ createInterpolateElement( getLabel( isBasedOnPublication ), {
					input: (
						<NumberControl
							className="nelio-content-social-message-editor__positive-days-selector"
							disabled={ disabled }
							value={ dateValue }
							min={ 2 }
							onChange={ ( value ) =>
								setDateTypeAndValue(
									'positive-days',
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
			/* translators: number of days */
			_x( '%s days after publication.', 'text', 'nelio-content' ),
			'<input/>'
		);
	} //end if

	return sprintf(
		/* translators: number of days */
		_x( 'In %s days.', 'text', 'nelio-content' ),
		'<input/>'
	);
};
