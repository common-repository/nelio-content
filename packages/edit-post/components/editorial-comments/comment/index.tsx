/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';

import { AuthorIcon, DeleteButton } from '@nelio-content/components';
import { useAuthorName, store as NC_DATA } from '@nelio-content/data';
import { dateI18n, getSettings } from '@nelio-content/date';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export type CommentProps = {
	readonly commentId: Uuid;
};

export const Comment = ( { commentId }: CommentProps ): JSX.Element => {
	const comment = useComment( commentId );
	const authorName = useAuthorName( comment?.authorId );

	const isBeingDeleted = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isDeletingEditorialComment( commentId )
	);
	const isBeingSynched = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isSynchingEditorialComment( commentId )
	);

	const isCurrentUsers = useIsCurrentUsers( commentId );
	const canBeDeleted = useCanBeDeleted( commentId );
	const { deleteEditorialComment } = useDispatch( NC_EDIT_POST );

	return (
		<div
			className={ classnames( {
				'nelio-content-editorial-comments-comment': true,
				'nelio-content-editorial-comments-comment--is-mine':
					isCurrentUsers,
				'nelio-content-editorial-comments-comment--is-being-deleted':
					isBeingDeleted,
			} ) }
		>
			{ ! isCurrentUsers && (
				<div className="nelio-content-editorial-comments-comment__author-icon">
					<AuthorIcon authorId={ comment?.authorId } />
				</div>
			) }

			<div>
				<div
					className={ classnames( {
						'nelio-content-editorial-comments-comment__bubble':
							true,
						'nelio-content-editorial-comments-comment__bubble--is-mine':
							isCurrentUsers,
					} ) }
				>
					{ comment?.comment || '' }
				</div>

				<div
					className={ classnames( {
						'nelio-content-editorial-comments-comment__extra': true,
						'nelio-content-editorial-comments-comment__extra--is-mine':
							isCurrentUsers,
					} ) }
				>
					{ isBeingSynched &&
						_x( 'Sending…', 'text', 'nelio-content' ) }
					{ ! isBeingSynched && ! isCurrentUsers && (
						<div className="nelio-content-editorial-comments-comment__author">
							{ authorName }
						</div>
					) }
					{ ! isBeingSynched && (
						<div className="nelio-content-editorial-comments-comment__date">
							{ dateI18n(
								getSettings().formats.datetime,
								comment?.date
							) }
						</div>
					) }
				</div>

				{ ( isBeingDeleted || canBeDeleted ) && ! isBeingSynched && (
					<div className="nelio-content-editorial-comments-comment__actions">
						<DeleteButton
							isDeleting={ isBeingDeleted }
							onClick={ () =>
								void deleteEditorialComment( commentId )
							}
						/>
					</div>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useComment = ( commentId: Uuid ) =>
	useSelect( ( select ) => select( NC_DATA ).getComment( commentId ) );

const useIsCurrentUsers = ( commentId: Uuid ) => {
	const comment = useComment( commentId );
	return useSelect(
		( select ) => select( NC_DATA ).getCurrentUserId() === comment?.authorId
	);
};

const useCanBeDeleted = ( commentId: Uuid ) => {
	const date = useComment( commentId )?.date;
	const isCurrentUsers = useIsCurrentUsers( commentId );

	const diff = date ? moment().diff( date, 'minutes' ) : 0;
	const isFresh = Math.abs( diff ) < 5;

	const [ tick, setTick ] = useState( 0 );
	useEffect( () => {
		if ( ! isFresh ) {
			return;
		} //end if
		setTimeout( () => setTick( tick + 1 ), 30000 );
	}, [ tick, isFresh ] );

	return isCurrentUsers && isFresh;
};
