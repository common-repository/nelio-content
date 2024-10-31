/**
 * WordPress dependencies
 */
import type { Dashicon } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type {
	AutomationSources,
	AutoShareEndModeId,
	Highlight,
} from './automations';
import type { AwsEditorialReference } from './editorial-references';
import type { SocialNetworkName } from './social-networks';
import type { Email, RegularQueryArg, Url } from './utils';

// =====
// POSTS
// =====

export type PostId = Brand< number, 'PostId' >;

export type Post = {
	readonly id: PostId;
	readonly author: AuthorId;
	readonly authorName: string;
	readonly content: string;
	readonly customFields: Record< MetaKey, CustomField >;
	readonly customPlaceholders: Record< CustomKey, CustomPlaceholder >;
	readonly date: string | false;
	readonly editLink: Url;
	readonly excerpt: string;
	readonly followers: ReadonlyArray< AuthorId >;
	readonly imageId: ImageId | 0;
	readonly imageSrc: Url | false;
	readonly images: ReadonlyArray< Url >;
	readonly permalink: Url;
	readonly permalinks: Partial< Record< SocialNetworkName, Url > >;
	readonly permalinkQueryArgs: ReadonlyArray< RegularQueryArg >;
	readonly permalinkTemplate: string;
	readonly status: PostStatusSlug;
	readonly taxonomies: Record< TaxonomySlug, ReadonlyArray< Term > >;
	readonly thumbnailSrc: Url | false;
	readonly title: string;
	readonly type: PostTypeName;
	readonly typeName: string;
	readonly viewLink: Url;
	readonly statistics: {
		readonly engagement: Partial<
			Record< SocialNetworkName | 'total' | 'comments', number >
		>;
		readonly pageviews: number | undefined;
	};
};

export type AwsPost = Omit< Post, 'date' | 'followers' | 'statistics' > & {
	readonly autoShareEndMode: AutoShareEndModeId;
	readonly automationSources: AutomationSources;
	readonly content: string;
	readonly date: string | 'none';
	readonly featuredImage: Url;
	readonly highlights: ReadonlyArray< Highlight >;
	readonly isAutoShareEnabled: boolean;
	readonly references: ReadonlyArray< AwsEditorialReference >;
	readonly timezone: string;
	readonly networkImages: Partial< Record< SocialNetworkName, Url > >;
};

export type NewPost = Pick<
	Post,
	'author' | 'title' | 'type' | 'taxonomies'
> & {
	readonly dateValue: string;
	readonly timeValue: string;
};

export type EditingPost = Post &
	Pick<
		AwsPost,
		| 'content'
		| 'autoShareEndMode'
		| 'automationSources'
		| 'isAutoShareEnabled'
	>;

// =================
// USERS AND AUTHORS
// =================

export type UserId = Brand< number, 'UserId' >;

export type AuthorId = UserId;

export type Author = {
	readonly id: AuthorId;
	readonly email: Email;
	readonly isAdmin: boolean;
	readonly name: string;
	readonly photo: Url;
};

// ==========
// POST TYPES
// ==========

export type PostTypeName = Brand< string, 'PostTypeName' >;

export type PostTypeContext =
	| 'analytics'
	| 'calendar'
	| 'comments'
	| 'content-board'
	| 'efi'
	| 'future-actions'
	| 'notifications'
	| 'quality-checks'
	| 'references'
	| 'social'
	| 'tasks';

export type PostType = {
	readonly name: PostTypeName;
	readonly labels: {
		readonly all: string;
		readonly edit: string;
		readonly new: string;
		readonly plural: string;
		readonly singular: string;
	};
	readonly supports: {
		readonly author: boolean;
		readonly title: boolean;
		readonly 'custom-fields': boolean;
		readonly editor: boolean;
		readonly excerpt: boolean;
		readonly 'post-formats': boolean;
		readonly thumbnail: boolean;
	};
	readonly statuses: ReadonlyArray< PostStatus >;
};

export type PostCapability =
	| 'read'
	| 'edit-own'
	| 'edit-others'
	| 'create'
	| 'publish'
	| 'delete-own'
	| 'delete-others';

// =============
// POST STATUSES
// =============

export type PostStatusSlug = Brand< string, 'PostStatusSlug' >;

export type PostStatus = {
	readonly slug: PostStatusSlug;
	readonly name: string;
	readonly icon?: Dashicon.Props[ 'icon' ];
	readonly available: boolean;
	readonly colors: {
		readonly main: string;
		readonly background: string;
	};
	readonly flags?: ReadonlyArray< PostStatusFlag >;
};

export type PostStatusFlag =
	| 'disabled-in-editor'
	| 'hide-in-board'
	| 'no-drop-in-board';

// =====
// MEDIA
// =====

export type MediaId = Brand< number, 'MediaId' >;
export type ImageId = MediaId;
export type VideoId = MediaId;

type Seconds = number;

export type MediaItem = {
	readonly id: MediaId;
	readonly duration: Seconds;
	readonly filesizeInBytes: number;
	readonly height: number;
	readonly mime: string;
	readonly url: Url;
	readonly width: number;
};

export type MediaLibraryItem = {
	readonly id: MediaId;
	readonly media_details: {
		readonly filesize: number;
		readonly height: number;
		readonly length?: number;
		readonly width: number;
	};
	readonly mime_type: string;
	readonly source_url: Url;
};

export type MediaUploadItem = {
	readonly id: MediaId;
	readonly fileLength: string;
	readonly filesizeInBytes: number;
	readonly height: number;
	readonly mime: string;
	readonly url: Url;
	readonly width: number;
};

// ==========
// TAXONOMIES
// ==========

export type { Taxonomy } from '@safe-wordpress/core-data';
export type TaxonomySlug = Brand< string, 'TaxonomySlug' >;

export type TermId = Brand< number, 'TermId' >;
export type Term = {
	readonly id: TermId;
	readonly name: string;
	readonly slug: string;
};

// ===========
// META FIELDS
// ===========

export type CustomField = {
	readonly key: MetaKey;
	readonly name: string;
	readonly value: string;
};

export type CustomPlaceholder = {
	readonly key: CustomKey;
	readonly name: string;
	readonly value: string;
};

export type MetaKey = Brand< string, 'MetaKey' >;
export type CustomKey = Brand< string, 'CustomKey' >;
