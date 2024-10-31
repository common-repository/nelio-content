/**
 * External dependencies
 */
import type {
	AuthorId,
	AutoShareEndModeId,
	AutomationSources,
	ImageId,
	Maybe,
	PostId,
	PostStatusSlug,
	PostTypeName,
	RegularQueryArg,
	TaxonomySlug,
	Term,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isPostReady( state: State ): boolean {
	return 'auto-draft' !== state.post.status && !! state.post.id;
} //end isPostReady()

export function getPost( state: State ): State[ 'post' ] {
	return state.post;
} //end getPost()

export function getPostId( state: State ): Maybe< PostId > {
	return state.post.id || undefined;
} //end getPostId()

export function getPostType( state: State ): Maybe< PostTypeName > {
	return state.post.type || undefined;
} //end getPostType()

export function getTitle( state: State ): string {
	return state.post.title || '';
} //end getTitle()

export function getExcerpt( state: State ): string {
	return state.post.excerpt || '';
} //end getExcerpt()

export function getContent( state: State ): string {
	return state.post.content || '';
} //end getContent()

export function getDate( state: State ): Maybe< string > {
	return state.post.date || undefined;
} //end getdate()

export function getAuthorId( state: State ): Maybe< AuthorId > {
	return state.post.author || undefined;
} //end getAuthorId()

export function getPermalink( state: State ): Maybe< Url > {
	return state.post.permalink || undefined;
} //end getPermalink()

export function getPermalinkTemplate( state: State ): string {
	return state.post.permalinkTemplate;
} //end getPermalinkTemplate()

export function getFollowers( state: State ): ReadonlyArray< AuthorId > {
	return state.post.followers || [];
} //end getFollowers()

export function getFeaturedImageId( state: State ): Maybe< ImageId > {
	return state.post.imageId || undefined;
} //end getFeaturedImageId()

export function getFeaturedImageSrc( state: State ): Maybe< Url > {
	return state.post.imageSrc || undefined;
} //end getFeaturedImageSrc()

export function getStatus( state: State ): PostStatusSlug {
	return state.post.status;
} //end getStatus()

export function getImages( state: State ): ReadonlyArray< Url > {
	return state.post.images || [];
} //end getImages()

export function getTerms(
	state: State,
	taxonomy: TaxonomySlug
): ReadonlyArray< Term > {
	return state.post.taxonomies[ taxonomy ] ?? [];
} //end getTerms()

export function getQueryArgs( state: State ): ReadonlyArray< RegularQueryArg > {
	return state.post.permalinkQueryArgs;
} //end getQueryArgs()

export function isAutoShareEnabled( state: State ): boolean {
	return !! state.post.isAutoShareEnabled;
} //end isAutoShareEnabled()

export function getAutoShareEndMode( state: State ): AutoShareEndModeId {
	return state.post.autoShareEndMode;
} //end getAutoShareEndMode()

export function getAutomationSources( state: State ): AutomationSources {
	return state.post.automationSources;
} //end getAutomationSources()
