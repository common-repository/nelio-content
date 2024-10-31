/**
 * External dependencies
 */
import type {
	AuthorId,
	AutoShareEndModeId,
	AutomationSources,
	EditingPost,
	ImageId,
	Maybe,
	MetaKey,
	PostId,
	PostStatusSlug,
	RegularQueryArg,
	TaxonomySlug,
	Term,
	Url,
} from '@nelio-content/types';

export type PostAction =
	| SetCustomField
	| RemoveCustomField
	| SetPost
	| SetPostId
	| SetTitle
	| SetExcerpt
	| SetContent
	| SetDate
	| SetAuthor
	| SetPermalink
	| SetFollowers
	| SetFeaturedImage
	| RemoveFeaturedImage
	| SetStatus
	| SetTerms
	| EnableAutoShare
	| SetAutoShareEndMode
	| SetAutomationSources
	| SetQueryArgs
	| MarkAsLoadingPostItems;

export function setCustomField( key: MetaKey, value: string ): SetCustomField {
	return {
		type: 'SET_CUSTOM_FIELD',
		key,
		value,
	};
} //end setCustomField()

export function removeCustomField( key: MetaKey ): RemoveCustomField {
	return {
		type: 'REMOVE_CUSTOM_FIELD',
		key,
	};
} //end removeCustomField()

export function setPost( post: EditingPost ): SetPost {
	return {
		type: 'SET_POST',
		post,
	};
} //end setPost()

export function setPostId( id: PostId ): SetPostId {
	return {
		type: 'SET_POST_ID',
		id,
	};
} //end setPostId()

export function setTitle( title: string ): SetTitle {
	return {
		type: 'SET_TITLE',
		title,
	};
} //end setTitle()

export function setExcerpt( excerpt: string ): SetExcerpt {
	return {
		type: 'SET_EXCERPT',
		excerpt,
	};
} //end setExcerpt()

export function setContent( content: string ): SetContent {
	return {
		type: 'SET_CONTENT',
		content,
	};
} //end setContent()

export function setDate( date: Maybe< string > ): SetDate {
	return {
		type: 'SET_DATE',
		date,
	};
} //end setDate()

export function setAuthor( authorId: AuthorId, authorName: string ): SetAuthor {
	return {
		type: 'SET_AUTHOR',
		authorId,
		authorName,
	};
} //end setAuthor()

export function setPermalink( permalink: Url ): SetPermalink {
	return {
		type: 'SET_PERMALINK',
		permalink,
	};
} //end setPermalink()

export function setFollowers(
	followerIds: ReadonlyArray< AuthorId >
): SetFollowers {
	return {
		type: 'SET_FOLLOWERS',
		followers: followerIds,
	};
} //end setFollowers()

export function setFeaturedImage(
	imageId: ImageId | 0,
	imageSrc: Url | false
): SetFeaturedImage {
	return {
		type: 'SET_FEATURED_IMAGE',
		imageId,
		imageSrc: imageSrc || false,
		thumbnailSrc: imageSrc || false,
	};
} //end setFeaturedImage()

export function removeFeaturedImage(): RemoveFeaturedImage {
	return {
		type: 'REMOVE_FEATURED_IMAGE',
	};
} //end removeFeaturedImage()

export function setStatus( status: PostStatusSlug ): SetStatus {
	return {
		type: 'SET_STATUS',
		status,
	};
} //end setStatus()

export function setTerms(
	taxonomy: TaxonomySlug,
	terms: ReadonlyArray< Term >
): SetTerms {
	return {
		type: 'SET_TERMS',
		taxonomy,
		terms,
	};
} //end setTerms()

export function enableAutoShare(
	isAutoShareEnabled: boolean
): EnableAutoShare {
	return {
		type: 'ENABLE_AUTO_SHARE',
		isAutoShareEnabled,
	};
} //end enableAutoShare()

export function setAutoShareEndMode(
	autoShareEndMode: AutoShareEndModeId
): SetAutoShareEndMode {
	return {
		type: 'SET_AUTO_SHARE_END_MODE',
		autoShareEndMode,
	};
} //end setAutoShareEndMode()

export function setAutomationSources(
	sources: Partial< AutomationSources >
): SetAutomationSources {
	return {
		type: 'SET_AUTOMATION_SOURCES',
		sources,
	};
} //end setAutomationSources()

export function setQueryArgs(
	args: ReadonlyArray< RegularQueryArg >
): SetQueryArgs {
	return {
		type: 'SET_QUERY_ARGS',
		args,
	};
} //end setQueryArgs()

export function markAsLoadingPostItems(
	isLoading: boolean
): MarkAsLoadingPostItems {
	return {
		type: 'MARK_AS_LOADING_POST_ITEMS',
		isLoading,
	};
} //end markAsLoadingPostItems()

// ============
// HELPER TYPES
// ============

type SetCustomField = {
	readonly type: 'SET_CUSTOM_FIELD';
	readonly key: MetaKey;
	readonly value: string;
};

type RemoveCustomField = {
	readonly type: 'REMOVE_CUSTOM_FIELD';
	readonly key: MetaKey;
};

export type SetPost = {
	readonly type: 'SET_POST';
	readonly post: EditingPost;
};

type SetPostId = {
	readonly type: 'SET_POST_ID';
	readonly id: PostId;
};

type SetTitle = {
	readonly type: 'SET_TITLE';
	readonly title: string;
};

type SetExcerpt = {
	readonly type: 'SET_EXCERPT';
	readonly excerpt: string;
};

export type SetContent = {
	readonly type: 'SET_CONTENT';
	readonly content: string;
};

type SetDate = {
	readonly type: 'SET_DATE';
	readonly date: Maybe< string >;
};

type SetAuthor = {
	readonly type: 'SET_AUTHOR';
	readonly authorId: AuthorId;
	readonly authorName: string;
};

type SetPermalink = {
	readonly type: 'SET_PERMALINK';
	readonly permalink: Url;
};

type SetFollowers = {
	readonly type: 'SET_FOLLOWERS';
	readonly followers: ReadonlyArray< AuthorId >;
};

type SetFeaturedImage = {
	readonly type: 'SET_FEATURED_IMAGE';
	readonly imageId: ImageId | 0;
	readonly imageSrc: Url | false;
	readonly thumbnailSrc: Url | false;
};

type RemoveFeaturedImage = {
	readonly type: 'REMOVE_FEATURED_IMAGE';
};

type SetStatus = {
	readonly type: 'SET_STATUS';
	readonly status: PostStatusSlug;
};

type SetTerms = {
	readonly type: 'SET_TERMS';
	readonly taxonomy: TaxonomySlug;
	readonly terms: ReadonlyArray< Term >;
};

type EnableAutoShare = {
	readonly type: 'ENABLE_AUTO_SHARE';
	readonly isAutoShareEnabled: boolean;
};

type SetAutoShareEndMode = {
	readonly type: 'SET_AUTO_SHARE_END_MODE';
	readonly autoShareEndMode: AutoShareEndModeId;
};

type SetAutomationSources = {
	readonly type: 'SET_AUTOMATION_SOURCES';
	readonly sources: Partial< AutomationSources >;
};

type SetQueryArgs = {
	readonly type: 'SET_QUERY_ARGS';
	readonly args: ReadonlyArray< RegularQueryArg >;
};

export type MarkAsLoadingPostItems = {
	readonly type: 'MARK_AS_LOADING_POST_ITEMS';
	readonly isLoading: boolean;
};
