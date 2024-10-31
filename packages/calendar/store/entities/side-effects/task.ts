/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { date } from '@nelio-content/date';
import { showErrorNotice } from '@nelio-content/utils';
import type { EditorialTask, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../../store';
import { setNewDayInTask } from '../../utils';

export async function rescheduleTask(
	taskId: Uuid,
	newLocalDay: string
): Promise< void > {
	const task = select( NC_DATA ).getTask( taskId );
	if ( ! task ) {
		return;
	} //end if

	const originalLocalDay = date( 'Y-m-d', task.dateDue );
	if ( originalLocalDay === newLocalDay ) {
		return;
	} //end if

	try {
		const newTask: EditorialTask = setNewDayInTask( newLocalDay, task );
		await beginUpdate( newTask );

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
			data: {
				...newTask,
				baseDatetime: 'reschedule',
			},
		} );

		await commitUpdate( updatedTask );
	} catch ( error ) {
		await rollback( task, error );
	} //end catch
} //end rescheduleTask()

export async function deleteTask( taskId: Uuid ): Promise< void > {
	const task = select( NC_DATA ).getTask( taskId );
	if ( ! task ) {
		return;
	} //end if

	try {
		await beginDeletion( task );

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

		await commitDeletion( task );
	} catch ( error ) {
		await rollback( task, error );
	} //end catch
} //end deleteTask()

export async function toggleTaskCompletion( taskId: Uuid ): Promise< void > {
	const task = select( NC_DATA ).getTask( taskId );
	if ( ! task ) {
		return;
	} //end if

	try {
		const newTask = { ...task, completed: ! task.completed };
		await beginUpdate( newTask );

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
			} catch ( e ) {
				await showErrorNotice( e );
			} //end catch
		} //end if

		await commitUpdate( { ...task, ...updatedTask } );
	} catch ( error ) {
		await rollback( task, error );
	} //end catch
} //end toggleTaskCompletion()

// =======
// HELPERS
// =======

async function beginUpdate( task: EditorialTask ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( task ) );
	await dispatch( NC_DATA ).receiveTasks( task );
} //end begin()

async function commitUpdate( task: EditorialTask ) {
	await dispatch( NC_DATA ).receiveTasks( task );
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( task ) );
} //end commit()

async function beginDeletion( task: EditorialTask ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( task ) );
	await dispatch( NC_DATA ).removeTask( task.id );
} //end begin()

async function commitDeletion( task: EditorialTask ) {
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( task ) );
} //end commit()

async function rollback( task: EditorialTask, error: unknown ) {
	await dispatch( NC_DATA ).receiveTasks( task );
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( task ) );
	await showErrorNotice( error );
} //end rollback()

function summarize( task: EditorialTask ) {
	return {
		type: 'task' as const,
		id: task.id,
		relatedPostId: task.postId,
	};
} //end summarize()
