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
import type { Maybe, UserId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_PRESETS } from '~/nelio-content-pages/settings/task-presets/store';

export const Assignee = (): JSX.Element | null => {
	const [ assigneeId, setAssigneeId ] = useAssigneeId();
	const isMultiAuthor = useIsMultiAuthor();

	if ( ! isMultiAuthor ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-task-template-editor__assignee">
			<AuthorSearcher
				hasAllAuthors
				allAuthorsLabel={ _x( 'Post Author', 'text', 'nelio-content' ) }
				value={ assigneeId || undefined }
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
	const attrs = useSelect( ( select ) =>
		select( NC_TASK_PRESETS ).getEditingTask()
	);
	const { editTaskTemplate } = useDispatch( NC_TASK_PRESETS );
	const setAssigneeId = ( assigneeId: Maybe< UserId > ) =>
		editTaskTemplate( { assigneeId } );
	return [ attrs.assigneeId, setAssigneeId ] as const;
};

const useIsMultiAuthor = () =>
	useSelect( ( select ) => select( NC_DATA ).isMultiAuthor );
