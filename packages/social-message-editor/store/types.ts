/**
 * External dependencies
 */
import type {
	EditingSocialMessage,
	Post,
	PostId,
	RecurrenceContext,
	RecurrenceSettings,
	ReusableSocialMessageId,
	SocialMessage,
	SocialNetworkName,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly attributes: {
		readonly profileIds: {
			readonly all: ReadonlyArray< Uuid >;
			readonly byNetwork: Partial<
				Record< SocialNetworkName, ReadonlyArray< Uuid > >
			>;
		};
		readonly targetNamesByProfile: Record<
			Uuid,
			ReadonlyArray< SocialTargetName >
		>;
		readonly typeByNetwork: Record<
			SocialNetworkName,
			SocialMessage[ 'type' ]
		>;
		readonly message: EditingSocialMessage;
		readonly relatedPost?: Post;
		readonly reusableMessage: ReusableMessageDetails;
	};

	readonly recurrence: {
		readonly context: RecurrenceContext;
		readonly mode: 'locked' | 'editable' | 'toggeable';
		readonly enabled: boolean;
		readonly editing: boolean;
		readonly settings: RecurrenceSettings;
	};

	readonly status: {
		readonly activeSocialNetwork: SocialNetworkName;
		readonly context: EditorContext;
		readonly disabledProfileIds: ReadonlyArray< Uuid >;
		readonly error: string;
		readonly isImageUrlSelectorVisible: boolean;
		readonly isPreviewVisible: boolean;
		readonly isSaving: boolean;
		readonly isVisible: boolean;
		readonly relatedPostStatus: RelatedPostStatus;
	};

	readonly targetSelector: {
		readonly profileId?: Uuid;
		readonly selectedTargetNames: ReadonlyArray< SocialTargetName >;
	};
};

export type EditorContext =
	| 'analytics'
	| 'calendar'
	| 'feeds'
	| 'post'
	| 'post-list';

export type RelatedPostStatus =
	| { type: 'none' }
	| { type: 'searcher' }
	| { type: 'loading'; postId: PostId }
	| { type: 'error'; postId: PostId }
	| { type: 'ready' };

export type ReusableMessageDetails = {
	readonly active: boolean;
	readonly id?: ReusableSocialMessageId;
};
