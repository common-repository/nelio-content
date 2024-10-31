/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Maybe } from '@nelio-content/types';

const TIME_REGEX = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/;

export type TimeInputProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly onChange: ( date: Maybe< string > ) => void;
	readonly value?: string;
};

export const TimeInput = ( {
	className = '',
	disabled,
	onChange,
	value,
}: TimeInputProps ): JSX.Element => {
	const [ workingValue, setWorkingValue ] = useState( value ?? '' );

	return (
		<input
			className={ className }
			type="time"
			disabled={ disabled }
			value={ value || workingValue }
			onChange={ ( event ) => {
				let newValue: Maybe< string > = event.target.value || '';
				setWorkingValue( newValue );

				if ( ! TIME_REGEX.test( newValue ) ) {
					newValue = undefined;
				} //end if

				onChange( newValue || undefined );
			} }
		/>
	);
};
