/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { EditorialTask } from '@nelio-content/types';

export type ColorOptionProps = {
	readonly color: Exclude< EditorialTask[ 'color' ], 'none' >;
	readonly disabled?: boolean;
	readonly label: string;
	readonly selected: boolean;
	readonly onChange: ( selected: boolean ) => void;
};

export const ColorOption = ( {
	color,
	disabled,
	label,
	selected,
	onChange,
}: ColorOptionProps ): JSX.Element => (
	<li
		className={ `nelio-content-task-colors__option nelio-content-task-colors__option--is-${ color }` }
	>
		<input
			disabled={ disabled }
			type="checkbox"
			checked={ !! selected }
			onChange={ ( event ) => onChange( !! event.target.checked ) }
			title={ label }
		/>{ ' ' }
		<span className="screen-reader-text">{ label }</span>
	</li>
);
