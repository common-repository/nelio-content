/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';

export type ProfileCheckboxProps = {
	readonly label: string;
	readonly checked: boolean;
	readonly onChange: ( checked: boolean ) => void;
};

export const ProfileCheckbox = ( {
	label,
	checked,
	onChange,
}: ProfileCheckboxProps ): JSX.Element => (
	<li>
		<CheckboxControl
			label={ label }
			checked={ checked }
			onChange={ onChange }
		/>
	</li>
);
