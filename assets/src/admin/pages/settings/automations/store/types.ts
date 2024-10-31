/**
 * External dependencies
 */
import type {
	AutomationGroupId,
	CustomField,
	CustomPlaceholder,
	ExportedSocialTemplate,
	Maybe,
	PostTypeName,
	RegularAutomationGroup,
	SocialTemplate,
	TaxonomySlug,
	UniversalAutomationGroup,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly automationGroups: {
		readonly byId: Record<
			RegularAutomationGroup[ 'id' ],
			RegularAutomationGroup
		> & { universal: UniversalAutomationGroup };
		readonly allIds: readonly [
			'universal',
			...RegularAutomationGroup[ 'id' ][],
		];
	};

	readonly validations: Record<
		RegularAutomationGroup[ 'id' ],
		GroupValidation
	> & { universal: GroupValidation };

	readonly frequencies: Record< Uuid, AutoFrequencies >;
	readonly isSaving: boolean;
	readonly templateEditor: TemplateEditor;
	readonly templateImportExport: Maybe< TemplateImporter | TemplateExporter >;
};

// ============
// HELPER TYPES
// ============

type TemplateId = Uuid;

export type AutoFrequencies = {
	readonly publication: number;
	readonly reshare: number;
};

export type TemplateEditor = {
	readonly attributes: Maybe< EditingSocialTemplate >;
	readonly isNew: boolean;
	readonly isNetwork: boolean;
	readonly customFields: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomField, 'value' > >
	>;
	readonly customPlaceholders: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomPlaceholder, 'value' > >
	>;
	readonly errors: TemplateErrors;
};

export type TemplateImporter = {
	readonly mode: 'import';
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
	readonly templateType: 'publication' | 'reshare';
};

export type TemplateExporter = {
	readonly mode: 'export';
	readonly templates: ReadonlyArray< ExportedSocialTemplate >;
};

export type EditingSocialTemplate = SocialTemplate & {
	readonly type: 'publication' | 'reshare';
};

export type GroupValidation = {
	readonly isPostTypeValid: boolean;
	readonly areAuthorsValid: boolean;
	readonly areTermsValid: Record< TaxonomySlug, boolean >;
	readonly socialProfileErrors: Record< Uuid, string | false >;
	readonly templateErrors: Record< TemplateId, TemplateErrors >;
};

export type TemplateErrors = {
	readonly target: string | false;
	readonly content: string | false;
	readonly author: string | false;
	readonly availability: string | false;
	readonly taxonomies: Partial< Record< TaxonomySlug, string | false > >;
};
