/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { keys, isEqual, orderBy, padStart, pick, some } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type {
	EditingPost,
	EditorialTask,
	Maybe,
	TaskPreset,
	TaskTemplate,
	Uuid,
} from '@nelio-content/types';
import {
	createTask,
	getBaseDatetime,
	getTaskDateDue,
	isDefined,
	showErrorNotice,
} from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export async function markTaskAsCompleted(
	taskId: Uuid,
	completed: boolean
): Promise< void > {
	const task = select( NC_DATA ).getTask( taskId );
	if ( ! task ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markEditorialTaskAsSynching( taskId, true );

	try {
		const newTask = { ...task, completed };
		await dispatch( NC_DATA ).receiveTasks( newTask );

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const updatedTask = await apiFetch< EditorialTask >( {
			url: `${ apiRoot }/site/${ siteId }/task/${ taskId }`,
			method: 'PUT',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: newTask,
		} );

		await dispatch( NC_DATA ).receiveTasks( updatedTask );

		if ( updatedTask.completed ) {
			try {
				await apiFetch( {
					path: '/nelio-content/v1/notifications/task',
					method: 'POST',
					data: {
						isNewTask: false,
						...updatedTask,
					},
				} );
			} catch ( _ ) {}
		} //end if
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_DATA ).receiveTasks( task );
	} //end catch

	await dispatch( NC_EDIT_POST ).markEditorialTaskAsSynching( taskId, false );
} //end markTaskAsCompleted()

export async function instantiatePresets(
	mode: 'replace' | 'merge',
	taskTemplates: TaskPreset[ 'tasks' ]
): Promise< void > {
	const post = select( NC_EDIT_POST ).getPost();
	if ( ! post ) {
		return;
	} //end if

	const state = mode === 'replace' ? 'replacing' : 'merging';
	await dispatch( NC_EDIT_POST ).setTaskPresetsState( state );

	const { getTaskIdsRelatedToPost } = resolveSelect( NC_DATA );
	const { getTask } = select( NC_DATA );
	const oldTaskIds = await getTaskIdsRelatedToPost( post.id );
	const oldTasks = oldTaskIds.map( getTask ).filter( isDefined );

	const existingTasks = 'replace' === mode ? [] : oldTasks;
	const newTasks = orderBy( taskTemplates.map( mksort ), '_sort' )
		.map( mktask( post, existingTasks ) )
		.filter( isDefined );

	if ( newTasks.length ) {
		try {
			const siteId = select( NC_DATA ).getSiteId();
			const apiRoot = select( NC_DATA ).getApiRoot();
			const token = select( NC_DATA ).getAuthenticationToken();

			await new Promise( ( r ) => setTimeout( r, 1000 ) );
			const result = await apiFetch< ReadonlyArray< EditorialTask > >( {
				url: `${ apiRoot }/site/${ siteId }/task`,
				method: 'POST',
				credentials: 'omit',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${ token }`,
				},
				data: {
					mode,
					postId: post.id,
					tasks: newTasks,
				},
			} );

			if ( mode === 'replace' ) {
				oldTaskIds.forEach( dispatch( NC_DATA ).removeTask );
			} //end if
			await dispatch( NC_DATA ).receiveTasks( result );
		} catch ( e ) {
			await showErrorNotice( e );
		} //end catch
	} //end if

	await dispatch( NC_EDIT_POST ).openTaskPresetLoader( false );
} //end instantiatePresets()

export async function deleteEditorialTask( taskId: Uuid ): Promise< void > {
	const task = select( NC_DATA ).getTask( taskId );
	if ( ! task ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markEditorialTaskAsDeleting( taskId, true );

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		await apiFetch( {
			url: `${ apiRoot }/site/${ siteId }/task/${ taskId }`,
			method: 'DELETE',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).removeTask( taskId );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_EDIT_POST ).markEditorialTaskAsDeleting( taskId, false );
} //end deleteEditorialTask()

// =======
// HELPERS
// =======

type NewTask = EditorialTask & { baseDatetime: string };

const mktask =
	( post: EditingPost, oldTasks: ReadonlyArray< EditorialTask > ) =>
	( template: TaskTemplate ): Maybe< NewTask > => {
		if ( ! template.assigneeId && ! post.author ) {
			return undefined;
		} //end if

		const task: NewTask = {
			...createTask(),
			assigneeId: template.assigneeId ?? post.author,
			task: template.task,
			color: template.color,
			dateType: template.dateType,
			dateValue: template.dateValue,
			postId: post.id,
			postType: post.type,
			dateDue: getTaskDateDue( {
				baseDatetime: post.date || 'now',
				dateType: template.dateType,
				dateValue: template.dateValue,
			} ),
			postAuthor: post.author,
			baseDatetime: getBaseDatetime( post, template.dateType ),
		};

		const cmp = pick( task, [
			'assigneeId',
			'task',
			'dateType',
			'dateValue',
		] );
		const isExistingTask = some( oldTasks, ( t ) =>
			isEqual( cmp, pick( t, keys( cmp ) ) )
		);

		return isExistingTask ? undefined : task;
	};

const mksort = ( tt: TaskTemplate ): TaskTemplate & { _sort: string } => {
	const days = Math.abs( Number.parseInt( tt.dateValue ) || 0 );
	let sort = '';
	sort +=
		tt.dateType === 'positive-days' || 0 === days
			? '1:' + padStart( `${ days }`, 5, '0' )
			: '0:' + padStart( `${ Math.abs( 9999 - days ) }`, 5, '0' );
	sort += ':';
	sort += tt.task;
	return { ...tt, _sort: sort };
};
