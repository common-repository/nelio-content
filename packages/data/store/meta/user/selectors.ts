/**
 * External dependencies
 */
import { flatten, keys, values } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import type {
	EditorialTask,
	Post,
	PostCapability,
	PostTypeName,
	PremiumItem,
	PremiumItemType,
	SocialMessage,
	UserId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isSubscribed } from '../plugin/selectors';
import { getProfilesWithoutMessagesRelatedToPost } from '../../social/selectors';
import type { State } from '../../config';

export function getCurrentUserId( state: State ): UserId {
	return state.meta.user.id;
} //end getCurrentUserId()

export function canCurrentUser(
	state: State,
	capability: PostCapability,
	postType?: PostTypeName
): boolean {
	if ( ! postType ) {
		return false;
	} //end if
	const data = state.meta.user.postTypeCapabilities;
	const permissions = data[ postType ];
	return !! permissions?.includes( capability );
} //end canCurrentUser()

export function canCurrentUserManagePlugin( state: State ): boolean {
	return 'manage' === state.meta.user.pluginPermission;
} //end canCurrentUserManagePlugin()

export function canCurrentUserCreatePosts( state: State ): boolean {
	const data = state.meta.user.postTypeCapabilities || {};
	const permissions = flatten( values( data ) );
	return permissions.includes( 'create' );
} //end canCurrentUserCreatePosts()

export function canCurrentUserViewPost( state: State, post?: Post ): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( ! canCurrentUser( state, 'read', post.type ) ) {
		return false;
	} //end if

	if ( 'publish' === post.status ) {
		return true;
	} //end if

	if ( canCurrentUser( state, 'edit-others', post.type ) ) {
		return true;
	} //end if

	const isAuthor = getCurrentUserId( state ) === post.author;
	return isAuthor && canCurrentUser( state, 'edit-own', post.type );
} //end canCurrentUserViewPost()

export function canCurrentUserEditPost( state: State, post?: Post ): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( canCurrentUser( state, 'edit-others', post.type ) ) {
		return true;
	} //end if

	const isAuthor = getCurrentUserId( state ) === post.author;
	return isAuthor && canCurrentUser( state, 'edit-own', post.type );
} //end canCurrentUserEditPost()

export function canCurrentUserDeletePost( state: State, post?: Post ): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( canCurrentUser( state, 'delete-others', post.type ) ) {
		return true;
	} //end if

	const isAuthor = getCurrentUserId( state ) === post.author;
	return isAuthor && canCurrentUser( state, 'delete-own', post.type );
} //end canCurrentUserDeletePost()

export function canCurrentUserPublishPost(
	state: State,
	post?: Post
): boolean {
	return !! post && canCurrentUser( state, 'publish', post.type );
} //end canCurrentUserPublishPost()

export function canCurrentUserUseAutomationsInPost(
	state: State,
	post?: Post
): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( 'none' === state.meta.user.socialEditorPermission ) {
		return false;
	} //end if

	if ( 'all' === state.meta.user.socialEditorPermission ) {
		return true;
	} //end if

	if ( canCurrentUser( state, 'edit-others', post.type ) ) {
		return true;
	} //end if

	const isPostAuthor = getCurrentUserId( state ) === post.author;
	return isPostAuthor && canCurrentUser( state, 'edit-own', post.type );
} //end canCurrentUserUseAutomationsInPost()

export function canCurrentUserCreateMessagesAlways( state: State ): boolean {
	return 'all' === state.meta.user.socialEditorPermission;
} //end canCurrentUserCreateMessagesAlways()

export function canCurrentUserCreateMessagesRelatedToPost(
	state: State,
	post?: Post
): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( isSubscribed( state ) ) {
		return couldSubscriberCreateMessagesRelatedToPost( state, post );
	} //end if

	const profiles = getProfilesWithoutMessagesRelatedToPost( state, post.id );
	return ! isEmpty( profiles );
} //end canCurrentUserCreateMessagesRelatedToPost()

export function couldSubscriberCreateMessagesRelatedToPost(
	state: State,
	post?: Post
): boolean {
	return !! post && canCurrentUserUseAutomationsInPost( state, post );
} //end couldSubscriberCreateMessagesRelatedToPost()

export function canCurrentUserEditSocialMessage(
	state: State,
	message?: SocialMessage
): boolean {
	if ( ! message ) {
		return false;
	} //end if

	if ( 'none' === state.meta.user.socialEditorPermission ) {
		return false;
	} //end if

	if ( 'publish' === message.status ) {
		return false;
	} //end if

	if ( message.isFreePreview ) {
		return false;
	} //end if

	if ( isEmpty( state.social.profiles.byId[ message.profileId ] ) ) {
		return false;
	} //end if

	if ( 'all' === state.meta.user.socialEditorPermission ) {
		return true;
	} //end if

	// NOTE. This block is a workaround to overcome messages that are missing a postType attribute.
	if ( message.postId && ! message.postType ) {
		const author = getCurrentUserId( state ) === message.postAuthor;
		const postTypes = keys( state.meta.site.postTypes );
		for ( const pt of postTypes ) {
			if ( canCurrentUser( state, 'edit-others', pt ) ) {
				return true;
			} // end if
			if ( author && canCurrentUser( state, 'edit-own', pt ) ) {
				return true;
			} //end if
		} //end for
		return false;
	} //end if

	if ( canCurrentUser( state, 'edit-others', message.postType ) ) {
		return true;
	} //end if

	const isRelatedPostAuthor =
		getCurrentUserId( state ) === message.postAuthor;
	return (
		isRelatedPostAuthor &&
		canCurrentUser( state, 'edit-own', message.postType )
	);
} //end canCurrentUserEditSocialMessage()

export function canCurrentUserDeleteSocialMessage(
	state: State,
	message?: SocialMessage
): boolean {
	return canCurrentUserEditSocialMessage( state, message );
} //end canCurrentUserDeleteSocialMessage()

export function canCurrentUserCreateTasksAlways( state: State ): boolean {
	return 'all' === state.meta.user.taskEditorPermission;
} //end canCurrentUserCreateTasksAlways()

export function canCurrentUserCreateTasksRelatedToPost(
	state: State,
	post?: Post
): boolean {
	if ( ! post ) {
		return false;
	} //end if

	if ( 'all' === state.meta.user.taskEditorPermission ) {
		return true;
	} //end if

	if ( 'none' === state.meta.user.taskEditorPermission ) {
		return false;
	} //end if

	if ( canCurrentUser( state, 'edit-others', post.type ) ) {
		return true;
	} //end if

	const isRelatedPostAuthor = getCurrentUserId( state ) === post.author;
	return (
		isRelatedPostAuthor && canCurrentUser( state, 'edit-own', post.type )
	);
} //end canCurrentUserCreateTasksRelatedToPost()

export function canCurrentUserEditTask(
	state: State,
	task?: EditorialTask
): boolean {
	if ( ! task ) {
		return false;
	} //end if

	if ( 'none' === state.meta.user.taskEditorPermission ) {
		return false;
	} //end if

	if ( task.assigneeId === getCurrentUserId( state ) ) {
		return true;
	} //end if

	if ( 'all' === state.meta.user.taskEditorPermission ) {
		return true;
	} //end if

	if ( canCurrentUser( state, 'edit-others', task.postType ) ) {
		return true;
	} //end if

	const isRelatedPostAuthor = getCurrentUserId( state ) === task.postAuthor;
	return (
		isRelatedPostAuthor &&
		canCurrentUser( state, 'edit-own', task.postType )
	);
} //end canCurrentUserEditTask()

export function canCurrentUserDeleteTask(
	state: State,
	task?: EditorialTask
): boolean {
	if ( ! task ) {
		return false;
	} //end if

	if ( 'none' === state.meta.user.taskEditorPermission ) {
		return false;
	} //end if

	return canCurrentUserEditTask( state, task );
} //end canCurrentUserDeleteTask()

export function canCurrentUserEditPremiumItem(
	state: State,
	typeName: PremiumItemType,
	item?: PremiumItem
): boolean {
	if ( ! item ) {
		return false;
	} //end if

	const permission =
		state.meta.user.premiumEditorPermissionsByType[ typeName ];
	if ( ! permission ) {
		return false;
	} //end if

	if ( 'none' === permission ) {
		return false;
	} //end if

	if ( 'all' === permission ) {
		return true;
	} //end if

	if ( canCurrentUser( state, 'edit-others', item.postType ) ) {
		return true;
	} //end if

	const isRelatedPostAuthor = getCurrentUserId( state ) === item.postAuthor;
	return (
		isRelatedPostAuthor &&
		canCurrentUser( state, 'edit-own', item.postType )
	);
} //end canCurrentUserEditPremiumItem()

export function canCurrentUserViewPremiumItem(
	state: State,
	typeName: PremiumItemType,
	item?: PremiumItem
): boolean {
	if ( ! item ) {
		return false;
	} //end if

	const permission =
		state.meta.user.premiumEditorPermissionsByType[ typeName ];
	if ( ! permission ) {
		return false;
	} //end if

	if ( canCurrentUserEditPremiumItem( state, typeName, item ) ) {
		return true;
	} //end if

	if ( canCurrentUser( state, 'read', item.postType ) ) {
		return true;
	} //end if

	return false;
} //end canCurrentUserViewPremiumItem()

export function canCurrentUserDeletePremiumItem(
	state: State,
	typeName: PremiumItemType,
	item?: PremiumItem
): boolean {
	return canCurrentUserEditPremiumItem( state, typeName, item );
} //end canCurrentUserDeletePremiumItem()
