/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, CheckboxControl, Modal } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual, omit, uniqWith, without } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, TaskPreset } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type TaskPresetLoaderProps = {
	readonly state: Maybe< 'selection' | 'replacing' | 'merging' >;
	readonly actions: 'add' | 'replace-or-merge';
	readonly selection: ReadonlyArray< TaskPreset[ 'id' ] >;
	readonly onUpdate: (
		selection: ReadonlyArray< TaskPreset[ 'id' ] >
	) => void;
	readonly onCancel: () => void;
	readonly onReplace: ( tasks: TaskPreset[ 'tasks' ] ) => void;
	readonly onMerge: ( tasks: TaskPreset[ 'tasks' ] ) => void;
};

export const TaskPresetLoader = ( {
	actions,
	state,
	selection: selectedIds,
	onUpdate,
	onCancel,
	onReplace,
	onMerge,
}: TaskPresetLoaderProps ): JSX.Element | null => {
	const presets = useTaskPresets();

	if ( ! state ) {
		return null;
	} //end if

	const selection = presets.filter( ( p ) => selectedIds.includes( p.id ) );
	const tasks = uniqWith(
		selection.flatMap( ( p ) => p.tasks ),
		( a, b ) => isEqual( omit( a, 'color' ), omit( b, 'color' ) )
	);

	return (
		<Modal
			className="nelio-content-task-preset-loader"
			title={ _x( 'Task Preset Loader', 'text', 'nelio-content' ) }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<div className="nelio-content-task-preset-loader__body">
				{ presets.map( ( p ) => (
					<CheckboxControl
						key={ p.id }
						label={ p.name }
						checked={ selectedIds.includes( p.id ) }
						onChange={ ( selected ) =>
							onUpdate(
								selected
									? [ ...selectedIds, p.id ]
									: without( selectedIds, p.id )
							)
						}
					/>
				) ) }
			</div>
			<div className="nelio-content-task-preset-loader__actions">
				<Button
					variant="secondary"
					disabled={ state !== 'selection' }
					className="nelio-content-task-preset-loader__cancel-action"
					onClick={ onCancel }
				>
					{ _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>
				<span className="nelio-content-task-preset-loader__spacer"></span>
				{ actions === 'add' ? (
					<Button
						variant="primary"
						isBusy={ state !== 'selection' }
						disabled={ state !== 'selection' }
						className="nelio-content-task-preset-loader__add-action"
						onClick={ () => onReplace( tasks ) }
					>
						{ state !== 'selection'
							? _x( 'Creating Tasks…', 'text', 'nelio-content' )
							: _x( 'Create Tasks', 'command', 'nelio-content' ) }
					</Button>
				) : (
					<>
						<Button
							variant="primary"
							isBusy={ state === 'replacing' }
							disabled={
								state !== 'selection' || ! selection.length
							}
							className="nelio-content-task-preset-loader__replace-action"
							onClick={ () => onReplace( tasks ) }
						>
							{ state === 'replacing'
								? _x(
										'Replacing Tasks…',
										'text',
										'nelio-content'
								  )
								: _x(
										'Replace Tasks',
										'command',
										'nelio-content'
								  ) }
						</Button>
						<Button
							variant="primary"
							isBusy={ state === 'merging' }
							disabled={
								state !== 'selection' || ! selection.length
							}
							className="nelio-content-task-preset-loader__merge-action"
							onClick={ () => onMerge( tasks ) }
						>
							{ state === 'merging'
								? _x(
										'Merging Tasks…',
										'text',
										'nelio-content'
								  )
								: _x(
										'Merge Tasks',
										'command',
										'nelio-content'
								  ) }
						</Button>
					</>
				) }
			</div>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useTaskPresets = (): ReadonlyArray< TaskPreset > =>
	useSelect( ( select ) => select( NC_DATA ).getTaskPresets() );
