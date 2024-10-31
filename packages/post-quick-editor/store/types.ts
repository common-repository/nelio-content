/**
 * External dependencies
 */
import type {
	AuthorId,
	EditorialComment,
	EditorialTask,
	Maybe,
	PostId,
	PostStatusSlug,
	PostTypeName,
	PremiumItems,
	TaskPreset,
	TaxonomySlug,
	Term,
	Url,
} from '@nelio-content/types';

export type State = {
	readonly attributes: {
		// BASIC.
		readonly id?: PostId;
		readonly title: string;
		readonly type: Maybe< PostTypeName >;
		readonly taxonomies: Record< TaxonomySlug, ReadonlyArray< Term > >;
		readonly authorId: Maybe< AuthorId >;
		readonly status: Maybe< PostStatusSlug >;
		readonly dateValue: string;
		readonly timeValue: string;

		// EDITOR.
		readonly referenceInput: string;
		readonly references: ReadonlyArray< EditorialReference >;
		readonly tasks: ReadonlyArray< EditorialTask >;
		readonly newComments: ReadonlyArray< EditorialComment >;

		readonly premiumItemsByType: Partial< {
			[ K in keyof PremiumItems ]: ReadonlyArray< PremiumItems[ K ] >;
		} >;
	};

	readonly status: {
		readonly error: string;
		readonly extraInfoTab: ExtraInfoTab;
		readonly isPublished: boolean;
		readonly isSaving: boolean;
		readonly isVisible: boolean;
	};

	readonly presetLoader: PresetLoader;
};

export type ExtraInfoTab =
	| 'none'
	| 'comments'
	| 'future-actions'
	| 'references'
	| 'tasks'
	| 'taxonomies';

export type PresetLoader = {
	readonly isOpen: boolean;
	readonly selection: ReadonlyArray< TaskPreset[ 'id' ] >;
};

export type EditorialReference = {
	readonly url: Url;
	readonly title?: string;
};
