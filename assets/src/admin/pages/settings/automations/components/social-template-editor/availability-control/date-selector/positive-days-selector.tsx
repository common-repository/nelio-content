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

export type PositiveDaysSelectorProps = {
	readonly value: number;
	readonly onChange: ( value: number ) => void;
	readonly resetSelector: () => void;
};

export const PositiveDaysSelector = ( {
	value,
	onChange,
	resetSelector,
}: PositiveDaysSelectorProps ): JSX.Element => {
	return (
		<BaseControl
			id="nelio-content-social-template-editor__date-selector"
			label={ _x( 'Date', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__date-selector">
				{ createInterpolateElement(
					sprintf(
						/* translators: number of days */
						_x(
							'%s days after publication.',
							'text',
							'nelio-content'
						),
						'<input/>'
					),
					{
						input: (
							<NumberControl
								className="nelio-content-social-template-editor__positive-days-selector"
								value={ value }
								min={ 2 }
								onChange={ ( newValue ) =>
									onChange( newValue ?? 2 )
								}
							/>
						),
					}
				) }
				<ResetButton resetDateTime={ resetSelector } />
			</div>
		</BaseControl>
	);
};
