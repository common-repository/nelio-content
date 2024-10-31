/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	select as doSelect,
	useSelect,
	useDispatch,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';
import { useDrop } from 'react-dnd';
import { store as NC_CALENDAR, useDraggingItem } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import { isRecurringMessage, isRecurringSource } from '@nelio-content/utils';
import type { DraggableItemSummary, Maybe } from '@nelio-content/types';

export type TrashProps = {
	readonly children: string | JSX.Element;
};

export const Trash = ( { children }: TrashProps ): JSX.Element | null => {
	const item = useDraggingItem();
	const canTrash = useCanTrash( item );
	const trash = useTrash();

	const [ { isHovered }, drop ] = useDrop( {
		accept: [ 'post', 'social', 'task' ],
		drop: trash,
		collect: ( monitor ) => ( {
			isHovered: monitor.canDrop() && monitor.isOver(),
		} ),
	} );

	if ( ! canTrash ) {
		return null;
	} //end if

	return (
		<div
			className={ classnames( {
				'nelio-content-header__drop-control': true,
				'nelio-content-header__trash-control': true,
				'nelio-content-header__trash-control--is-hovered': isHovered,
			} ) }
			ref={ drop }
		>
			{ children }
		</div>
	);
};

// =====
// HOOKS
// =====

const useCanTrash = ( item: Maybe< DraggableItemSummary > ) =>
	useSelect( ( select ): boolean => {
		select( NC_DATA );
		if ( ! item ) {
			return false;
		} //end if

		switch ( item.type ) {
			case 'reusable-message':
				return false;

			case 'social':
				const { getSocialMessage, canCurrentUserDeleteSocialMessage } =
					select( NC_DATA );
				const message = getSocialMessage( item.id );
				return canCurrentUserDeleteSocialMessage( message );

			case 'task':
				const { getTask, canCurrentUserDeleteTask } = select( NC_DATA );
				const task = getTask( item.id );
				return canCurrentUserDeleteTask( task );

			case 'post':
				const { getPost, canCurrentUserDeletePost } = select( NC_DATA );
				const post = getPost( item.id );
				return canCurrentUserDeletePost( post );
		} //end switch
	} );

const useTrash = () => {
	const {
		deleteSocialMessage,
		deleteTask,
		dragEnd,
		requestRecurringTrashMode,
		trashPost,
	} = useDispatch( NC_CALENDAR );

	const trash = ( { id, type }: DraggableItemSummary ) => {
		switch ( type ) {
			case 'post':
				return trashPost( id );
			case 'social': {
				const m = doSelect( NC_DATA ).getSocialMessage( id );
				return isRecurringMessage( m ) && ! isRecurringSource( m )
					? requestRecurringTrashMode( { id } )
					: deleteSocialMessage(
							id,
							isRecurringMessage( m ) && isRecurringSource( m )
								? 'following'
								: undefined
					  );
			} //end case
			case 'task':
				return deleteTask( id );

			case 'reusable-message':
				return noop();
		} //end switch
	};

	return ( item: DraggableItemSummary ) => {
		void trash( item );
		void dragEnd();
		return undefined;
	};
};
