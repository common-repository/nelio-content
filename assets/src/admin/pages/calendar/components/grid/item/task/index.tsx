/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	store as NC_CALENDAR,
	useItem,
	useItemHoverListeners,
} from '@nelio-content/calendar';
import { AuthorIcon } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_TASK_EDITOR } from '@nelio-content/task-editor';

import type { LegacyRef } from 'react';
import type { EditorialTask, Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type TaskProps = {
	readonly className?: string;
	readonly itemId: Uuid;
	readonly dragReference: LegacyRef< HTMLDivElement >;
	readonly isClickable: boolean;
};

export const Task = ( {
	className = '',
	itemId,
	dragReference,
	isClickable,
}: TaskProps ): JSX.Element | null => {
	const task = useItem( 'task', itemId ) as Maybe< EditorialTask >;
	const canEditTask = useCanEditTask( task );

	const { toggleTaskCompletion } = useDispatch( NC_CALENDAR );
	const { openTaskViewerDialog: view } = useDispatch( NC_CALENDAR );
	const { openExistingTaskEditor: edit } = useDispatch( NC_TASK_EDITOR );

	const onClick = () =>
		!! task &&
		isClickable &&
		( canEditTask
			? edit( task, { context: 'calendar', post: undefined } )
			: view( itemId ) );
	const { onMouseEnter, onMouseLeave } = useItemHoverListeners(
		'task',
		itemId
	);

	if ( ! task ) {
		return null;
	} //end if

	const { assigneeId, color, completed, task: taskDesc } = task;
	return (
		<div // eslint-disable-line
			role={ _x( 'Task', 'text', 'nelio-content' ) }
			className={ classnames( {
				'nelio-content-calendar-task': true,
				[ className ]: true,
				[ `nelio-content-calendar-task--is-${ color }` ]: !! color,
			} ) }
			data-item-id={ itemId }
			onClick={ ( ev ) =>
				'INPUT' !== ( ev.target as HTMLElement )?.nodeName && onClick()
			}
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
			ref={ dragReference }
		>
			<AuthorIcon
				className="nelio-content-calendar-task__author-icon"
				authorId={ assigneeId }
			/>
			<div className="nelio-content-calendar-task__value">
				<input
					type="checkbox"
					checked={ completed }
					disabled={ ! canEditTask }
					onChange={ () => void toggleTaskCompletion( itemId ) }
				/>
				<span>{ taskDesc }</span>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useCanEditTask = ( task: Maybe< EditorialTask > ) =>
	useSelect( ( select ) => select( NC_DATA ).canCurrentUserEditTask( task ) );
