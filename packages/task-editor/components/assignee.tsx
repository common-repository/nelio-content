/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { AuthorSearcher } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../store';

export type AssigneeProps = {
	readonly disabled?: boolean;
};

export const Assignee = ( { disabled }: AssigneeProps ): JSX.Element | null => {
	const [ assigneeId, setAssigneeId ] = useAssigneeId();
	const isMultiAuthor = useIsMultiAuthor();

	if ( ! isMultiAuthor ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-task-editor__assignee">
			<AuthorSearcher
				disabled={ disabled }
				value={ assigneeId }
				onChange={ setAssigneeId }
				placeholder={ _x(
					'Assign task to…',
					'command',
					'nelio-content'
				) }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAssigneeId = () => {
	const assigneeId = useSelect( ( select ) =>
		select( NC_TASK_EDITOR ).getAssigneeId()
	);
	const { setAssigneeId } = useDispatch( NC_TASK_EDITOR );
	return [ assigneeId, setAssigneeId ] as const;
};

const useIsMultiAuthor = () =>
	useSelect( ( select ) => select( NC_DATA ).isMultiAuthor );
