/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch, resolveSelect } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { showErrorNotice } from '@nelio-content/utils';
import type { Post, PostId, PostStatusSlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from '../../../store';
import { setNewDayAndTimeInPost } from '../../utils';

export async function reschedulePost(
	postId: PostId,
	newLocalDay: string,
	newLocalHour?: string
): Promise< void > {
	const post = await resolveSelect( NC_DATA ).getPost( postId );
	if ( ! post ) {
		return;
	} //end if

	const defaultHour = select( NC_DATA ).getDefaultTime( 'post' );
	const newPost = ! newLocalHour
		? setNewDayAndTimeInPost( newLocalDay, defaultHour, post )
		: setNewDayAndTimeInPost( newLocalDay, newLocalHour, post );

	if ( newPost.date === post.date ) {
		return;
	} //end if

	try {
		await beginUpdate( newPost );

		const updatedPost = await apiFetch< Post >( {
			path: addQueryArgs(
				`/nelio-content/v1/post/${ postId }/reschedule`,
				{
					day: newLocalDay,
					hour: newLocalHour,
					defaultHour,
				}
			),
			method: 'PUT',
		} );

		await dispatch( NC_DATA ).reloadPostRelatedItems( updatedPost.id );
		await commitUpdate( updatedPost );
	} catch ( error ) {
		await rollback( post, error );
	} //end catch
} //end reschedulePost()

export async function unschedulePost( postId: PostId ): Promise< void > {
	const post = await resolveSelect( NC_DATA ).getPost( postId );
	if ( ! post ) {
		return;
	} //end if

	try {
		await beginUpdate( {
			...post,
			status:
				post.status === 'future'
					? ( 'draft' as PostStatusSlug )
					: post.status,
			date: false,
		} );

		const updatedPost = await apiFetch< Post >( {
			path: `/nelio-content/v1/post/${ postId }/unschedule`,
			method: 'PUT',
		} );

		await dispatch( NC_DATA ).reloadPostRelatedItems( updatedPost.id );
		await commitUpdate( updatedPost );
	} catch ( error ) {
		await rollback( post, error );
	} //end catch
} //end unschedulePost()

export async function trashPost( postId: PostId ): Promise< void > {
	const post = await resolveSelect( NC_DATA ).getPost( postId );
	if ( ! post ) {
		return;
	} //end if

	try {
		await beginDeletion( post );

		await apiFetch( {
			path: `/nelio-content/v1/post/${ postId }/trash`,
			method: 'PUT',
		} );

		await dispatch( NC_DATA ).reloadPostRelatedItems( post.id );
		await commitDeletion( post );
	} catch ( error ) {
		await rollback( post, error );
	} //end catch
} //end trashPost()

// =======
// HELPERS
// =======

async function beginUpdate( post: Post ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( post ) );
	await dispatch( NC_DATA ).receivePosts( post );
} //end beginUpdate()

async function commitUpdate( post: Post ) {
	await dispatch( NC_DATA ).receivePosts( post );
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( post ) );
} //end commitUpdate()

async function beginDeletion( post: Post ) {
	await dispatch( NC_CALENDAR ).markAsUpdating( summarize( post ) );
	await dispatch( NC_DATA ).removePost( post.id );
} //end beginDeletion()

async function commitDeletion( post: Post ) {
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( post ) );
} //end commitDeletion()

async function rollback( post: Post, error: unknown ) {
	await dispatch( NC_CALENDAR ).markAsUpdated( summarize( post ) );
	await dispatch( NC_DATA ).receivePosts( post );
	await showErrorNotice( error );
} //end rollback()

function summarize( post: Post ) {
	return {
		type: 'post' as const,
		id: post.id,
		relatedPostId: post.id,
	};
} //end summarize()
