/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect, useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Maybe } from '@nelio-content/types';

const DATE_REGEX =
	/^([0-9]+)-((0[1-9])|(1[012]))-((0[1-9])|([12][0-9])|(3[01]))$/;

export type DateInputProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly max?: string;
	readonly min?: string;
	readonly onChange: ( date: Maybe< string > ) => void;
	readonly value?: string;
};

export const DateInput = ( {
	className = '',
	disabled,
	max,
	min,
	onChange,
	value,
}: DateInputProps ): JSX.Element => {
	const [ workingValue, setWorkingValue ] = useState( value ?? '' );

	useEffect( () => {
		if ( ! isDate( workingValue ) ) {
			return;
		} //end if

		if ( isDate( min ) && workingValue < min ) {
			setWorkingValue( '' );
		} else if ( isDate( max ) && max < workingValue ) {
			setWorkingValue( '' );
		} //end if
	}, [ min, max, workingValue ] );

	return (
		<input
			className={ className }
			type="date"
			disabled={ disabled }
			value={ value || workingValue }
			onChange={ ( event ) => {
				let newValue: Maybe< string > = event.target.value || '';
				setWorkingValue( newValue );

				if ( ! DATE_REGEX.test( newValue ) ) {
					newValue = undefined;
				} //end if

				if ( newValue && min && newValue < min ) {
					newValue = undefined;
				} //end if

				if ( newValue && max && newValue > max ) {
					newValue = undefined;
				} //end if

				onChange( newValue || undefined );
			} }
			min={ min }
			max={ max }
		/>
	);
};

// =======
// HELPERS
// =======

const isDate = ( d?: string ): d is string => !! d && d.length === 10;
