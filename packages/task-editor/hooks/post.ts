/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../store';
import type { Post, RelatedPostStatus } from '../store/types';

export const useRelatedPost = (): [
	Maybe< Post >,
	( post: PostId ) => void,
] => {
	const post = useSelect( ( select ) => select( NC_TASK_EDITOR ).getPost() );
	const { setPost: doSetPost } = useDispatch( NC_TASK_EDITOR );
	const setPost = useSelect( ( select ) => ( postId: PostId ) => {
		const newPost = select( NC_DATA ).getPost( postId );
		if ( ! newPost ) {
			return;
		} //end if
		void doSetPost( newPost );
	} );
	return [ post, setPost ];
};

export const useRelatedPostId = (): Maybe< PostId > =>
	useSelect( ( select ) => select( NC_TASK_EDITOR ).getPostId() );

export const useIsRelatedPostReadOnly = (): boolean => {
	const isExistingTaskInCalendar = useSelect( ( select ) => {
		const isExistingTask = ! select( NC_TASK_EDITOR ).isNewTask();
		const context = select( NC_TASK_EDITOR ).getEditorContext();
		return 'calendar' === context && isExistingTask;
	} );

	const postId = useSelect( ( select ) => {
		const taskId = select( NC_TASK_EDITOR ).getAttributes()?.id;
		return select( NC_DATA ).getTask( taskId )?.postId;
	} );

	const { post, isLoadingPost } = useSelect( ( select ) => {
		const thePost =
			isExistingTaskInCalendar && postId
				? select( NC_DATA ).getPost( postId )
				: undefined;

		return {
			post: thePost,
			isLoadingPost:
				isExistingTaskInCalendar &&
				!! postId &&
				! thePost &&
				! select( NC_DATA ).hasFinishedResolution( 'getPost', [
					postId,
				] ),
		};
	} );

	const { setPost, setRelatedPostStatus } = useDispatch( NC_TASK_EDITOR );
	useEffect( () => {
		if ( ! isExistingTaskInCalendar ) {
			return;
		} //end if
		if ( isLoadingPost ) {
			void setRelatedPostStatus( 'loading' );
		} else if ( post ) {
			void setPost( post );
			void setRelatedPostStatus( 'ready' );
		} else if ( postId ) {
			void setRelatedPostStatus( 'error' );
		} else {
			void setRelatedPostStatus( 'none' );
		} //end if
	}, [
		isExistingTaskInCalendar,
		isLoadingPost,
		postId,
		post,
		setPost,
		setRelatedPostStatus,
	] );

	return isExistingTaskInCalendar && !! postId;
};

export const useIsRelatedPostHidden = (): boolean =>
	useSelect( ( select ) => {
		const context = select( NC_TASK_EDITOR ).getEditorContext();
		const isExistingTask = ! select( NC_TASK_EDITOR ).isNewTask();
		const hasRelatedPost =
			'none' !== select( NC_TASK_EDITOR ).getRelatedPostStatus();
		return 'calendar' !== context || ( isExistingTask && ! hasRelatedPost );
	} );

export const useRelatedPostStatus = (): RelatedPostStatus =>
	useSelect( ( select ) => select( NC_TASK_EDITOR ).getRelatedPostStatus() );
