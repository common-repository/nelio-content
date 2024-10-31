/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { keys, isEqual, pick, some } from 'lodash';
import { TaskPresetLoader } from '@nelio-content/components';
import { createTask, getTaskDateDue, isDefined } from '@nelio-content/utils';
import type {
	Maybe,
	EditorialTask,
	TaskTemplate,
	UserId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../store';

export const TaskPresets = (): JSX.Element => {
	const state = useTaskPresetLoaderState();
	const doesPostHaveTasks = useSelect(
		( select ) => !! select( NC_POST_EDITOR ).getTasks().length
	);
	const { openTaskPresetLoader, setTasks } = useDispatch( NC_POST_EDITOR );

	const oldTasks = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTasks()
	);
	const mktask = useTaskMaker( oldTasks );

	const [ selection, setSelection ] = useTaskPresetSelection();

	return (
		<TaskPresetLoader
			state={ state }
			actions={ doesPostHaveTasks ? 'replace-or-merge' : 'add' }
			selection={ selection }
			onUpdate={ setSelection }
			onCancel={ () => openTaskPresetLoader( false ) }
			onMerge={ ( tts ) => {
				void setTasks( [
					...oldTasks,
					...tts.map( mktask( 'merge' ) ).filter( isDefined ),
				] );
				void openTaskPresetLoader( false );
			} }
			onReplace={ ( tts ) => {
				void setTasks(
					tts.map( mktask( 'replace' ) ).filter( isDefined )
				);
				void openTaskPresetLoader( false );
			} }
		/>
	);
};

// =====
// HOOKS
// =====

const useTaskPresetSelection = () => {
	const selection = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTaskPresetSelection()
	);
	const { selectTaskPresets } = useDispatch( NC_POST_EDITOR );
	return [ selection, selectTaskPresets ] as const;
};

const useTaskMaker = ( oldTasks: ReadonlyArray< EditorialTask > ) => {
	const { postAuthor, postId, postType, postDate } = useSelect(
		( select ) => ( {
			postAuthor: select( NC_POST_EDITOR ).getAuthorId(),
			postId: select( NC_POST_EDITOR ).getId(),
			postType: select( NC_POST_EDITOR ).getPostType(),
			postDate: select( NC_POST_EDITOR ).getDateValue(),
		} )
	);

	return ( mode: 'merge' | 'replace' ) =>
		( tt: TaskTemplate ): Maybe< EditorialTask > => {
			const task = {
				...createTask(),
				assigneeId: tt.assigneeId ?? postAuthor ?? ( 0 as UserId ),
				task: tt.task,
				color: tt.color,
				dateType: tt.dateType,
				dateValue: tt.dateValue,
				postId,
				postType,
				dateDue: getTaskDateDue( {
					baseDatetime: postDate || 'now',
					dateType: tt.dateType,
					dateValue: tt.dateValue,
				} ),
				postAuthor,
			};

			const cmp = pick( task, [
				'assigneeId',
				'task',
				'dateType',
				'dateValue',
			] );
			const isExistingTask =
				'merge' === mode &&
				some( oldTasks, ( t ) =>
					isEqual( cmp, pick( t, keys( cmp ) ) )
				);

			return isExistingTask ? undefined : task;
		};
};

const useTaskPresetLoaderState = () =>
	useSelect( ( select ) =>
		select( NC_POST_EDITOR ).isTaskPresetLoaderOpen()
			? ( 'selection' as const )
			: undefined
	);
