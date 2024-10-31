/**
 * Internal dependencies
 */
import type { Uuid } from './utils';
import type { EditorialTask } from './editorial-tasks';
import type { ExternalEvent } from './external-calendars';
import type { InternalEvent } from './internal-events';
import type { ReusableSocialMessageId, SocialMessage } from './social-messages';
import type {
	AuthorId,
	Post,
	PostId,
	PostTypeName,
} from './wordpress-entities';

// =====
// ITEMS
// =====

export type FreeItem =
	| Post
	| ExternalEvent
	| InternalEvent
	| EditorialTask
	| SocialMessage;

export type Item = FreeItem | PremiumItem;

// ==============
// ITEM SUMMARIES
// ==============

export type FreeItemType = FreeItemSummary[ 'type' ];
export type FreeItemSummary =
	| PostSummary
	| ExternalEventSummary
	| InternalEventSummary
	| EditorialTaskSummary
	| SocialMessageSummary;

export type ItemType = ItemSummary[ 'type' ];
export type ItemSummary = FreeItemSummary | PremiumItemSummary;

export type PostSummary = {
	readonly type: 'post';
	readonly id: PostId;
	readonly day: string;
	readonly relatedPostId: PostId;
	readonly sort: string;
};

export type ExternalEventSummary = {
	readonly type: 'external-event';
	readonly id: Uuid;
	readonly day: string;
	readonly sort: string;
	readonly relatedPostId?: never;
};

export type InternalEventSummary = {
	readonly type: 'internal-event';
	readonly id: Uuid;
	readonly day: string;
	readonly sort: string;
	readonly relatedPostId?: never;
};

export type EditorialTaskSummary = {
	readonly type: 'task';
	readonly id: Uuid;
	readonly day: string;
	readonly relatedPostId?: PostId;
	readonly sort: string;
};

export type SocialMessageSummary = {
	readonly type: 'social';
	readonly id: Uuid;
	readonly day: string;
	readonly relatedPostId?: PostId;
	readonly recurrenceGroup?: Uuid;
	readonly sort: string;
};

// ========================
// DRAGGABLE ITEM SUMMARIES
// ========================

export type FreeDraggableItemSummary =
	| DraggablePostSummary
	| DraggableSocialMessageSummary
	| DraggableEditorialTaskSummary
	| DraggableReusableMessageSummary;

export type DraggableItemSummary =
	| FreeDraggableItemSummary
	| PremiumDraggableItemSummary;

export type DraggablePostSummary = _DIS< 'post', PostId >;
export type DraggableSocialMessageSummary = _DIS< 'social', Uuid >;
export type DraggableEditorialTaskSummary = _DIS< 'task', Uuid >;
export type DraggableReusableMessageSummary = _DIS<
	'reusable-message',
	ReusableSocialMessageId
>;

type _DIS< T extends string, ID > = {
	readonly type: T;
	readonly id: ID;
	readonly minDroppableDay: string;
};

// =======
// PREMIUM
// =======

export type PremiumItemType = keyof PremiumItems;

export interface PremiumItems {
	readonly [ 'ts-example' ]: PremiumItemExample;
}
export type PremiumItem = PremiumItems[ keyof PremiumItems ];

export interface PremiumItemSummaries {
	readonly [ 'ts-example' ]: PremiumItemSummaryExample;
}
export type PremiumItemSummary =
	PremiumItemSummaries[ keyof PremiumItemSummaries ];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PremiumDraggableItemSummaries {}
export type PremiumDraggableItemSummary =
	PremiumDraggableItemSummaries[ keyof PremiumDraggableItemSummaries ];

type PremiumItemExample = {
	readonly id: number;
	readonly postAuthor?: AuthorId;
	readonly postId?: PostId;
	readonly postType?: PostTypeName;
};

type PremiumItemSummaryExample = PremiumItemExample & {
	readonly type: 'ts-example';
	readonly day: string;
	readonly relatedPostId?: PostId;
	readonly sort: string;
};
