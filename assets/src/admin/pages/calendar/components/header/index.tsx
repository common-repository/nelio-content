/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR, useDraggingItem } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import { DefaultHeader } from './default';
import { DraggingHeader } from './dragging';
import type { DraggableItemSummary } from '@nelio-content/types';

export type HeaderProps = {
	readonly className?: string;
};

const RELEVANT_DRAGGING_TYPES: ReadonlyArray< DraggableItemSummary[ 'type' ] > =
	[ 'post', 'social', 'task' ];

export const Header = ( { className = '' }: HeaderProps ): JSX.Element => {
	const draggingItemType = useDraggingItem()?.type;
	const adminSidebarWidth = useSelect( ( select ) =>
		select( NC_CALENDAR ).getAdminSidebarWidth()
	);

	return (
		<div
			className={ `nelio-content-header ${ className }` }
			style={ {
				width: `calc(100% - ${ adminSidebarWidth }px)`,
			} }
		>
			{ !! draggingItemType &&
			RELEVANT_DRAGGING_TYPES.includes( draggingItemType ) ? (
				<DraggingHeader type={ draggingItemType } />
			) : (
				<DefaultHeader />
			) }
		</div>
	);
};
