/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import {
	getSocialMessageSchedule,
	getTaskDateDue,
	isEmpty,
} from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export async function loadPostItems(): Promise< void > {
	const isPostReady = select( NC_EDIT_POST ).isPostReady();
	if ( ! isPostReady ) {
		return;
	} //end if

	const postId = select( NC_EDIT_POST ).getPostId();
	if ( ! postId ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markAsLoadingPostItems( true );
	await resolveSelect( NC_DATA ).getPostRelatedItems( postId );
	await dispatch( NC_EDIT_POST ).updateDatesInPostRelatedItems();
	await dispatch( NC_EDIT_POST ).markAsLoadingPostItems( false );
} //end loadPostItems()

export async function updateDatesInPostRelatedItems(): Promise< void > {
	const post = select( NC_EDIT_POST ).getPost();
	const { status, date, id } = post;
	if ( 'publish' === status || ! date ) {
		return;
	} //end if

	const messages =
		await resolveSelect( NC_DATA ).getSocialMessagesRelatedToPost( id );
	const newMessages = map( messages, ( message ) => ( {
		...message,
		schedule: getSocialMessageSchedule( {
			baseDatetime: date,
			dateValue: message.dateValue,
			timeType: message.timeType,
			timeValue: message.timeValue,
		} ),
	} ) );

	const tasks = await resolveSelect( NC_DATA ).getTasksRelatedToPost( id );
	const newTasks = map( tasks, ( task ) => ( {
		...task,
		dateDue: getTaskDateDue( {
			baseDatetime: date,
			dateType: task.dateType,
			dateValue: task.dateValue,
		} ),
	} ) );

	if ( ! isEmpty( newMessages ) ) {
		await dispatch( NC_DATA ).receiveSocialMessages( newMessages );
	} //end if

	if ( ! isEmpty( newTasks ) ) {
		await dispatch( NC_DATA ).receiveTasks( newTasks );
	} //end if
} //end updateDatesInPostRelatedItems()
