/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';
import { createSocialMessage, getValue, hasHead } from '@nelio-content/utils';
import { filter, map, omitBy, isNil } from 'lodash';

import type {
	Maybe,
	Post,
	ReusableSocialMessage,
	ReusableSocialMessageId,
	SocialMessage,
	SocialNetworkName,
	SocialNetworkSupport,
	SocialProfile,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type {
	EditorContext,
	RelatedPostStatus,
	ReusableMessageDetails,
} from '../../types';

export type UIAction =
	| OpenEditorAction
	| CloseEditorAction
	| SetActiveSocialNetworkAction
	| SetRelatedPostStatusAction
	| SetValidationErrorAction
	| ShowImageUrlSelectorAction;

export function openNewSocialMessageEditor(
	attrs: Partial< SocialMessage | ReusableSocialMessage > = {},
	options: SocialMessageEditorOptions
): Maybe< OpenEditorAction > {
	const {
		disabledProfileIds: dpi = [],
		isPreviewVisible = !! getValue(
			'isSocialMessagePreviewVisible',
			false
		),
		post,
	} = options;

	const disabledProfileIds = getAllDisabledProfileIds( dpi, attrs, options );
	const validProfiles = getValidProfiles( disabledProfileIds );
	if ( hasHead( validProfiles ) && 1 === validProfiles.length ) {
		const { id: profileId, network } = validProfiles[ 0 ];
		if ( ! doesNetworkSupport( 'multi-target', network ) ) {
			attrs = {
				...attrs,
				profileId,
				network,
			};
		} //end if
	} //end if

	const validNetworks = map( validProfiles, 'network' );
	return {
		type: 'OPEN_EDITOR',
		activeSocialNetwork: attrs.network ?? validNetworks[ 0 ] ?? 'twitter',
		disabledProfileIds,
		isPreviewVisible,
		context: options.context,
		message: {
			...createSocialMessage(),
			...omitBy( attrs, isNil ),
		},
		post,
		reusableMessage: {
			active: !! options.reusableMessage,
			id:
				'number' === typeof options.reusableMessage
					? options.reusableMessage
					: undefined,
		},
	};
} //end openNewSocialMessageEditor()

export function close(): CloseEditorAction {
	return {
		type: 'CLOSE_EDITOR',
	};
} //end close()

export function setActiveSocialNetwork(
	network: SocialNetworkName
): SetActiveSocialNetworkAction {
	return {
		type: 'SET_ACTIVE_SOCIAL_NETWORK',
		network,
	};
} //end setActiveSocialNetwork()

export function setRelatedPostStatus(
	status: RelatedPostStatus
): SetRelatedPostStatusAction {
	return {
		type: 'SET_RELATED_POST_STATUS',
		status,
	};
} //end setRelatedPostStatus()

export function setValidationError( error: string ): SetValidationErrorAction {
	return {
		type: 'SET_VALIDATION_ERROR',
		error,
	};
} //end setValidationError()

export function showImageUrlSelector(
	isVisible: boolean
): ShowImageUrlSelectorAction {
	return {
		type: 'SHOW_IMAGE_URL_SELECTOR',
		isVisible,
	};
} //end showImageUrlSelector()

// ============
// HELPER TYPES
// ============

export type OpenEditorAction = {
	readonly type: 'OPEN_EDITOR';
	readonly activeSocialNetwork: SocialNetworkName;
	readonly context: EditorContext;
	readonly disabledProfileIds: ReadonlyArray< Uuid >;
	readonly isPreviewVisible: boolean;
	readonly message: Omit< SocialMessage, 'id' | 'profileId' | 'network' > &
		Pick< Partial< SocialMessage >, 'id' | 'profileId' | 'network' >;
	readonly post: Maybe< Post >;
	readonly reusableMessage: ReusableMessageDetails;
};

export type SocialMessageEditorOptions = {
	readonly context: EditorContext;
	readonly disabledProfileIds?: ReadonlyArray< Uuid >;
	readonly isLoadingRelatedPost?: boolean;
	readonly isPreviewVisible?: boolean;
	readonly post?: Post;
	readonly reusableMessage?: true | ReusableSocialMessageId;
};

export type CloseEditorAction = {
	readonly type: 'CLOSE_EDITOR';
};

type SetActiveSocialNetworkAction = {
	readonly type: 'SET_ACTIVE_SOCIAL_NETWORK';
	readonly network: SocialNetworkName;
};

type SetRelatedPostStatusAction = {
	readonly type: 'SET_RELATED_POST_STATUS';
	readonly status: RelatedPostStatus;
};

type SetValidationErrorAction = {
	readonly type: 'SET_VALIDATION_ERROR';
	readonly error: string;
};

type ShowImageUrlSelectorAction = {
	readonly type: 'SHOW_IMAGE_URL_SELECTOR';
	readonly isVisible: boolean;
};

// =======
// HELPERS
// =======

function getAllDisabledProfileIds(
	potentiallyDisabledIds: ReadonlyArray< Uuid >,
	attrs: Partial< SocialMessage | ReusableSocialMessage > = {},
	options: SocialMessageEditorOptions
): ReadonlyArray< Uuid > {
	const isSubscribed = select( NC_DATA ).isSubscribed();
	const disabledIds = [
		...( isSubscribed ? [] : potentiallyDisabledIds ),
		...( options.reusableMessage
			? getProfileIdsMissing( 'reusability' )
			: [] ),
		...( 'recurrenceGroup' in attrs
			? getProfileIdsMissing( 'recurrence' )
			: [] ),
	];
	return disabledIds;
} //end getAllDisabledProfileIds()

function getProfileIdsMissing(
	feature: SocialNetworkSupport
): ReadonlyArray< Uuid > {
	const profiles = select( NC_DATA ).getSocialProfiles();
	return profiles
		.filter( ( p ) => ! doesNetworkSupport( feature, p.network ) )
		.map( ( p ) => p.id );
} //end getProfileIdsMissing()

function getValidProfiles(
	disabledIds: ReadonlyArray< Uuid >
): ReadonlyArray< SocialProfile > {
	return filter(
		select( NC_DATA ).getSocialProfiles(),
		( p ) => ! disabledIds.includes( p.id )
	);
} //end getValidProfiles()
