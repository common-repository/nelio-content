/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import {
	createTask,
	getBaseDatetime,
	getTaskDateDue,
	logError,
} from '@nelio-content/utils';
import type { EditorialTask } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../../../store';

export async function saveAndClose(): Promise< void > {
	const isSaving = select( NC_TASK_EDITOR ).isSaving();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NC_TASK_EDITOR ).markAsSaving( true );

	const post = select( NC_TASK_EDITOR ).getPost();
	const attrs = select( NC_TASK_EDITOR ).getAttributes();
	const task: EditorialTask = {
		...createTask(),
		...attrs,
		postId: post?.id,
		postType: post?.type,
		postAuthor: post?.author,
		dateDue: getTaskDateDue( {
			baseDatetime:
				! post || post.status === 'publish' || ! post.date
					? 'now'
					: post.date,
			dateType: attrs.dateType,
			dateValue: attrs.dateValue,
		} ),
	};
	const customOnSave = select( NC_TASK_EDITOR ).getCustomOnSave();
	if ( customOnSave ) {
		customOnSave( task );
		await dispatch( NC_TASK_EDITOR ).markAsSaving( false );
		await dispatch( NC_TASK_EDITOR ).close();
		return;
	} //end if

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const isNewTask = select( NC_TASK_EDITOR ).isNewTask();
		const method = isNewTask ? 'POST' : 'PUT';
		const url =
			! isNewTask && !! task.id
				? `${ apiRoot }/site/${ siteId }/task/${ task.id }`
				: `${ apiRoot }/site/${ siteId }/task`;

		const savedTask = await apiFetch< EditorialTask >( {
			url,
			method,
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: {
				...task,
				baseDatetime: isNewTask
					? getBaseDatetime( post, task.dateType )
					: 'reschedule',
			},
		} );

		await dispatch( NC_DATA ).receiveTasks( savedTask );

		try {
			await apiFetch( {
				path: '/nelio-content/v1/notifications/task',
				method: 'POST',
				data: {
					isNewTask,
					...savedTask,
				},
			} );
		} catch ( _ ) {}
	} catch ( e ) {
		logError( e );
	} //end catch

	await dispatch( NC_TASK_EDITOR ).markAsSaving( false );
	await dispatch( NC_TASK_EDITOR ).close();
} //end saveAndClose()
