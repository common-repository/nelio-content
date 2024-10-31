/**
 * External dependencies
 */
import type { DraggableItemSummary, ItemSummary } from '@nelio-content/types';

export type DragAction =
	| DragStartAction
	| DragEndAction
	| HoverItemAction
	| HoverEndAction;

export function dragStart( item: DraggableItemSummary ): DragStartAction {
	return {
		type: 'DRAG_START',
		item,
	};
} //end dragStart()

export function dragEnd(): DragEndAction {
	return {
		type: 'DRAG_END',
	};
} //end dragEnd()

export function setHoverItem(
	item?: ItemSummary
): HoverItemAction | HoverEndAction {
	if ( ! item ) {
		return {
			type: 'HOVER_END',
		};
	} //end if

	return {
		type: 'HOVER_ITEM',
		item,
	};
} //end setHoverItem()

// ============
// HELPER TYPES
// ============

type DragStartAction = {
	readonly type: 'DRAG_START';
	readonly item: DraggableItemSummary;
};

type DragEndAction = {
	readonly type: 'DRAG_END';
};

type HoverItemAction = {
	readonly type: 'HOVER_ITEM';
	readonly item: ItemSummary;
};

type HoverEndAction = {
	readonly type: 'HOVER_END';
};
