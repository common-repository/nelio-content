/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextareaControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useRef, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import {
	store as NC_DATA,
	useAuthorName,
	withSubscriptionCheck,
} from '@nelio-content/data';
import { DeleteButton } from '@nelio-content/components';
import { dateI18n, getSettings } from '@nelio-content/date';
import { createComment } from '@nelio-content/utils';
import type {
	EditorialComment,
	PostId,
	PostTypeName,
	UserId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../store';

export const Comments = (): JSX.Element => <InternalComments />;

const InternalComments = withSubscriptionCheck(
	'raw/editorial-comments',
	() => (
		<div className="nelio-content-pqe-extra__comments">
			<CommentList />
			<CommentForm />
		</div>
	)
);

// =======
// HELPERS
// =======

const CommentList = (): JSX.Element | null => {
	const ref = useRef< HTMLUListElement >( null );
	const { comments, newComments } = useComments();
	const deleteComment = useDeleteComment();

	const currentCount = newComments.length;
	const [ count, setCount ] = useState( -1 );
	useEffect( () => {
		if ( count === currentCount ) {
			return;
		} //end if

		if ( count < currentCount ) {
			ref.current?.scrollTo( {
				top: 999_999,
				behavior: count === -1 ? undefined : 'smooth',
			} );
		} //end if

		setCount( currentCount );
	}, [ count, currentCount, setCount ] );

	return (
		<ul ref={ ref } className="nelio-content-pqe-extra__comment-list">
			{ comments.map( ( comment ) => (
				<Comment
					key={ `nelio-content-comment-${ comment.id }` }
					comment={ comment }
				/>
			) ) }
			{ newComments.map( ( comment ) => (
				<Comment
					key={ `nelio-content-comment-${ comment.id }` }
					comment={ comment }
					onDelete={ () => deleteComment( comment.id ) }
				/>
			) ) }
		</ul>
	);
};

const CommentForm = (): JSX.Element => {
	const [ value, setValue ] = useState( '' );
	const addComment = useAddComment();
	return (
		<div className="nelio-content-pqe-extra__comment-form">
			<TextareaControl
				placeholder={ _x(
					'Write a comment and press enter to send…',
					'user',
					'nelio-content'
				) }
				value={ value }
				onChange={ setValue }
				onKeyDown={ ( ev ) => {
					if ( 'Enter' !== ev.key ) {
						return;
					} //end if
					ev.preventDefault();
					addComment( value );
					setValue( '' );
				} }
			/>
		</div>
	);
};

type CommentProps = {
	readonly comment: EditorialComment;
	readonly onDelete?: () => void;
};
const Comment = ( { comment, onDelete }: CommentProps ) => {
	const isSaving = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).isSaving()
	);
	const isCurrentUsers = useIsCurrentUsers( comment?.authorId );
	const authorName = useAuthorName( comment?.authorId );

	return (
		<li
			className={ classnames( 'nelio-content-pqe-extra__comment', {
				'nelio-content-pqe-extra__comment--is-mine': isCurrentUsers,
			} ) }
		>
			<div>
				<div
					className={ classnames( {
						'nelio-content-pqe-extra__comment-bubble': true,
						'nelio-content-pqe-extra__comment-bubble--is-mine':
							isCurrentUsers,
					} ) }
				>
					{ comment?.comment || '' }
				</div>

				{ ! onDelete ? (
					<div
						className={ classnames( {
							'nelio-content-pqe-extra__comment-extra': true,
							'nelio-content-pqe-extra__comment-extra--is-mine':
								isCurrentUsers,
						} ) }
					>
						{ ! isCurrentUsers && (
							<div className="nelio-content-pqe-extra__comment-author">
								{ authorName }
							</div>
						) }
						<div className="nelio-content-pqe-extra__comment-date">
							{ dateI18n(
								getSettings().formats.datetime,
								comment?.date
							) }
						</div>
					</div>
				) : (
					<div className="nelio-content-pqe-extra__comment-actions">
						<span>
							{ isSaving
								? _x( 'Saving…', 'text', 'nelio-content' )
								: _x(
										'New',
										'text (editorial comment)',
										'nelio-content'
								  ) }
						</span>
						{ ' • ' }
						<DeleteButton
							disabled={ isSaving }
							onClick={ onDelete }
						/>
					</div>
				) }
			</div>
		</li>
	);
};

// =====
// HOOKS
// =====

const useComments = () =>
	useSelect( ( select ) => {
		const postId = select( NC_POST_EDITOR ).getId();
		const comments = select( NC_DATA ).getCommentsRelatedToPost( postId );
		const newComments = select( NC_POST_EDITOR ).getNewComments();
		return { comments, newComments };
	} );

const useDeleteComment = () => {
	const { setNewComments } = useDispatch( NC_POST_EDITOR );
	return useSelect( ( select ) => {
		const newComments = select( NC_POST_EDITOR ).getNewComments();
		return ( id: EditorialComment[ 'id' ] ): void =>
			void setNewComments( newComments.filter( ( c ) => c.id !== id ) );
	} );
};

const useAddComment = () => {
	const { setNewComments } = useDispatch( NC_POST_EDITOR );
	return useSelect( ( select ) => {
		const newComments = select( NC_POST_EDITOR ).getNewComments();
		return ( comment: EditorialComment[ 'comment' ] ): void => {
			comment = trim( comment );
			if ( ! comment ) {
				return;
			} //end if
			void setNewComments( [
				...newComments,
				{
					...createComment( 0 as PostId, 'post' as PostTypeName ),
					comment,
				},
			] );
		};
	} );
};

const useIsCurrentUsers = ( commentAuthor?: UserId ) =>
	useSelect(
		( select ) => select( NC_DATA ).getCurrentUserId() === commentAuthor
	);
