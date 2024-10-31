/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { TaskTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';

import { ColorOption } from './color-option';

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
		<div className={ `nelio-content-task-template-colors ${ className }` }>
			<p className="screen-reader-text">
				{ _x( 'Select a color:', 'user', 'nelio-content' ) }
			</p>

			<ul className="nelio-content-task-template-colors__list">
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
	const attrs = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTask()
	);
	const { editTaskTemplate } = useDispatch( NC_TASK_PRESETS );
	const setColor = ( color: TaskTemplate[ 'color' ] ) =>
		editTaskTemplate( { color } );
	return [ attrs.color, setColor ] as const;
};

// ====
// DATA
// ====

type Option = {
	readonly value: Exclude< TaskTemplate[ 'color' ], 'none' >;
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
