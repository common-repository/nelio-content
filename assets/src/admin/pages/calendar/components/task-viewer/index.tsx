/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingModal } from '@nelio-content/components';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { useAuthorName, store as NC_DATA } from '@nelio-content/data';
import type { EditorialTask, Maybe, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export const TaskViewer = (): JSX.Element | null => {
	const task = useTask();
	const relatedPost = useRelatedPost( task?.postId );
	const { assignee, assigner } = useUsers( task );

	const { openTaskViewerDialog } = useDispatch( NC_CALENDAR );
	const close = () => openTaskViewerDialog();

	if ( ! task ) {
		return null;
	} //end if

	return (
		<LoadingModal
			className="nelio-content-calendar-task-viewer"
			isLoading={ 'loading' === relatedPost.status }
			title={ _x( 'Task Details', 'text', 'nelio-content' ) }
			onClose={ close }
		>
			<ul className="nelio-content-calendar-task-viewer__content">
				<li>
					<strong>{ _x( 'Task:', 'text', 'nelio-content' ) }</strong>
					{ ` ${ task.task }` }
				</li>

				<li>
					<strong>
						{ _x( 'Assignee:', 'text', 'nelio-content' ) }
					</strong>{ ' ' }
					{ assignee ||
						_x( 'Unknown user', 'text', 'nelio-content' ) }
				</li>

				<li>
					<strong>
						{ _x( 'Creator:', 'text', 'nelio-content' ) }
					</strong>{ ' ' }
					{ assigner ||
						_x( 'Unknown user', 'text', 'nelio-content' ) }
				</li>

				{ 'error' === relatedPost.status && (
					<li>
						<strong>
							{ _x( 'Related Post:', 'text', 'nelio-content' ) }
						</strong>{ ' ' }
						{ _x(
							'Related post could not be loaded',
							'text',
							'nelio-content'
						) }
					</li>
				) }

				{ 'loaded' === relatedPost.status && (
					<li>
						<strong>
							{ _x( 'Related Post:', 'text', 'nelio-content' ) }
						</strong>{ ' ' }
						<ExternalLink href={ relatedPost.post.permalink }>
							{ relatedPost.post.title }
						</ExternalLink>
					</li>
				) }
			</ul>

			<div className="nelio-content-calendar-task-viewer__actions">
				<Button variant="secondary" onClick={ close }>
					{ _x( 'Close', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</LoadingModal>
	);
};

// =====
// HOOKS
// =====

const useTask = () =>
	useSelect( ( select ) => {
		const { getTask } = select( NC_DATA );
		const { getTaskIdInTaskViewer } = select( NC_CALENDAR );
		const taskId = getTaskIdInTaskViewer();
		return taskId ? getTask( taskId ) : undefined;
	} );

const useRelatedPost = ( postId: Maybe< PostId > ) =>
	useSelect( ( select ) => {
		if ( ! postId ) {
			return { status: 'none' as const };
		} //end if

		const post = select( NC_DATA ).getPost( postId );
		if ( ! post ) {
			return {
				status: select( NC_DATA ).isResolving( 'getPost', [ postId ] )
					? ( 'loading' as const )
					: ( 'error' as const ),
			};
		} //end if

		return { post, status: 'loaded' as const };
	} );

const useUsers = ( task: Maybe< EditorialTask > ) => ( {
	assignee: useAuthorName( task?.assigneeId ),
	assigner: useAuthorName( task?.assignerId ),
} );
