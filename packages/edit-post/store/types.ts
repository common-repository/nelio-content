/**
 * External dependencies
 */
import type {
	AutoShareEndMode,
	Dict,
	EditingPost,
	EditorialReference,
	Maybe,
	PremiumItemType,
	PremiumItems,
	QualityCheckName,
	QualityCheckResult,
	QualityCheckType,
	TaskPreset,
	Url,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly comments: {
		readonly synching: ReadonlyArray< Uuid >;
		readonly deleting: ReadonlyArray< Uuid >;
		readonly input: string;
		readonly isRetrievingComments: boolean;
	};

	readonly externalFeaturedImage: {
		readonly view: 'no-image' | 'image' | 'edit-image';
		readonly fields: {
			readonly url: string;
			readonly alt: string;
		};
		readonly imageUrl: Maybe< Url >;
		readonly imageAlt: string;
	};

	readonly post: EditingPost;

	readonly postQuality: {
		readonly checks: Record< QualityCheckName, QualityCheckResult >;
		readonly isFullyIntegrated: boolean;
		readonly settings: {
			readonly allowedBads: number;
			readonly allowedImprovables: number;
			readonly unacceptableImprovables: number;
		};
	};

	readonly qualityCheckTypes: Record< QualityCheckName, QualityCheckType >;

	readonly references: {
		readonly byUrl: Record< Url, EditorialReference >;
		readonly byType: {
			readonly suggested: ReadonlyArray< Url >;
		};
		readonly status: {
			readonly loading: ReadonlyArray< Url >;
			readonly saving: ReadonlyArray< Url >;
		};
		readonly editor:
			| {
					readonly isActive: false;
			  }
			| {
					readonly isActive: true;
					readonly reference: EditorialReference;
			  };
		readonly suggestedUrl: string;
	};

	readonly settings: {
		readonly isClassicEditor: boolean;
		readonly isElementorEditor: boolean;
		readonly panels: Dict< boolean >;
		readonly shouldAuthorBeFollower: boolean;
		readonly autoShareEndModes: ReadonlyArray< AutoShareEndMode >;
	};

	readonly social: {
		readonly deleting: ReadonlyArray< Uuid >;
		readonly timelineStatus: 'ready' | 'generating' | 'clearing';
		readonly isRetrievingSocialMessages: boolean;
	};

	readonly tasks: {
		readonly preset: Maybe< PresetLoader >;
		readonly synching: ReadonlyArray< Uuid >;
		readonly deleting: ReadonlyArray< Uuid >;
		readonly isRetrievingTasks: boolean;
	};

	readonly premiumByType: Partial< {
		[ K in PremiumItemType ]: {
			readonly deleting: ReadonlyArray< PremiumItems[ K ][ 'id' ] >;
		};
	} >;
};

// ============
// HELPER TYPES
// ============

export type PresetLoader = {
	readonly selection: ReadonlyArray< TaskPreset[ 'id' ] >;
	readonly state: 'selection' | 'merging' | 'replacing';
};
