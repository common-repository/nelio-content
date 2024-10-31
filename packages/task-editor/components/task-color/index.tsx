/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { EditorialTask } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { ColorOption } from './color-option';
import { store as NC_TASK_EDITOR } from '../../store';

export type TaskColorProps = {
	readonly className?: string;
	readonly disabled?: boolean;
};

export const TaskColor = ( {
	className = '',
	disabled,
}: TaskColorProps ): JSX.Element => {
	const [ color, setColor ] = useColor();
	return (
		<div className={ `nelio-content-task-colors ${ className }` }>
			<p className="screen-reader-text">
				{ _x( 'Select a color:', 'user', 'nelio-content' ) }
			</p>

			<ul className="nelio-content-task-colors__list">
				{ COLOR_OPTIONS.map( ( { value, label } ) => (
					<ColorOption
						key={ value }
						disabled={ disabled }
						color={ value }
						label={ label }
						selected={ color === value }
						onChange={ ( selected ) =>
							selected ? setColor( value ) : setColor( 'none' )
						}
					/>
				) ) }
			</ul>
		</div>
	);
};

// =====
// HOOKS
// =====

const useColor = () => {
	const color = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getColor()
	);
	const { setColor } = useDispatch( NC_TASK_EDITOR );
	return [ color, setColor ] as const;
};

// ====
// DATA
// ====

type Option = {
	readonly value: Exclude< EditorialTask[ 'color' ], 'none' >;
	readonly label: string;
};

const COLOR_OPTIONS: ReadonlyArray< Option > = [
	{ value: 'red', label: _x( 'Red', 'text', 'nelio-content' ) },
	{ value: 'orange', label: _x( 'Orange', 'text', 'nelio-content' ) },
	{ value: 'yellow', label: _x( 'Yellow', 'text', 'nelio-content' ) },
	{ value: 'green', label: _x( 'Green', 'text', 'nelio-content' ) },
	{ value: 'cyan', label: _x( 'Cyan', 'text', 'nelio-content' ) },
	{ value: 'blue', label: _x( 'Blue', 'text', 'nelio-content' ) },
	{ value: 'purple', label: _x( 'Purple', 'text', 'nelio-content' ) },
];
