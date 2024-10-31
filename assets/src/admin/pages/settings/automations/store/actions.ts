/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	AutomationGroup,
	AutomationGroupId,
	CustomField,
	CustomPlaceholder,
	ExportedSocialTemplate,
	PostTypeName,
	ProfileAutomationSettings,
	RegularAutomationGroup,
	RegularAutomationGroupId,
	SocialProfile,
	SocialTemplate,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type {
	AutoFrequencies,
	EditingSocialTemplate,
	GroupValidation,
	TemplateErrors,
} from './types';

export type Action =
	| AddAutomationGroup
	| AddProfileSettings
	| CloseTemplateEditor
	| CloseTemplateImportExport
	| DeleteAutomationGroup
	| DeleteAutomationGroupTemplate
	| InitAutomationGroups
	| MarkAsNetworkTemplate
	| MarkAsSaving
	| OpenTemplateEditor
	| OpenTemplateImporter
	| OpenTemplateExporter
	| ReceiveAutomationGroupTemplates
	| ReceiveCustomFields
	| ReceiveCustomPlaceholders
	| SetAutomationGroupValidation
	| SetEditingTemplateAttributes
	| SetEditingTemplateErrors
	| SetProfileFrequencies
	| UpdateAutomationGroup;

export function addAutomationGroup(
	group: RegularAutomationGroup
): AddAutomationGroup {
	return {
		type: 'ADD_AUTOMATION_GROUP',
		group,
	};
} //end addAutomationGroup()

export function updateAutomationGroup(
	groupId: AutomationGroupId,
	attrs: Partial< Omit< AutomationGroup, 'id' > >
): UpdateAutomationGroup {
	return {
		type: 'UPDATE_AUTOMATION_GROUP',
		groupId,
		attrs,
	};
} //end updateAutomationGroup()

export function addProfileSettings(
	groupId: AutomationGroupId,
	settings: ProfileAutomationSettings
): AddProfileSettings {
	return {
		type: 'ADD_PROFILE_SETTINGS',
		groupId,
		settings,
	};
} //end addProfileSettings()

export function closeTemplateEditor(): CloseTemplateEditor {
	return {
		type: 'CLOSE_TEMPLATE_EDITOR',
	};
} //end closeTemplateEditor()

export function closeTemplateImportExport(): CloseTemplateImportExport {
	return {
		type: 'CLOSE_TEMPLATE_IMPORT_EXPORT',
	};
} //end closeTemplateImportExport()

export function deleteAutomationGroup(
	groupId: RegularAutomationGroupId
): DeleteAutomationGroup {
	return {
		type: 'DELETE_AUTOMATION_GROUP',
		groupId,
	};
} //end deleteAutomationGroup()

export function deleteAutomationGroupTemplate(
	template: SocialTemplate
): DeleteAutomationGroupTemplate {
	return {
		type: 'DELETE_AUTOMATION_GROUP_TEMPLATE',
		template,
	};
} //end deleteAutomationGroupTemplate()

export function initAutomationGroups(
	automationGroups: ReadonlyArray< AutomationGroup >,
	profiles: ReadonlyArray< SocialProfile >
): InitAutomationGroups {
	return {
		type: 'INIT_AUTOMATION_GROUPS',
		automationGroups,
		profiles,
	};
} //end initAutomationGroups()

export function openTemplateEditor(
	templateType: 'publication' | 'reshare',
	template: SocialTemplate,
	isNew?: 'new'
): OpenTemplateEditor {
	return {
		type: 'OPEN_TEMPLATE_EDITOR',
		template: { ...template, type: templateType },
		isNew: isNew === 'new',
	};
} //end openTemplateEditor()

export function openTemplateImporter(
	groupId: AutomationGroupId,
	profileId: Uuid,
	templateType: 'publication' | 'reshare'
): OpenTemplateImporter {
	return {
		type: 'OPEN_TEMPLATE_IMPORTER',
		groupId,
		profileId,
		templateType,
	};
} //end openTemplateImporter()

export function openTemplateExporter(
	templates: ExportedSocialTemplate | ReadonlyArray< ExportedSocialTemplate >
): OpenTemplateExporter {
	return {
		type: 'OPEN_TEMPLATE_EXPORTER',
		templates: castArray( templates ),
	};
} //end openTemplateExporter()

export function receiveAutomationGroupTemplates(
	templateType: 'publication' | 'reshare',
	templates: SocialTemplate | ReadonlyArray< SocialTemplate >
): ReceiveAutomationGroupTemplates {
	return {
		type: 'RECEIVE_AUTOMATION_GROUP_TEMPLATES',
		templateType,
		templates: castArray( templates ),
	};
} //end receiveAutomationGroupTemplates()

export function receiveCustomFields(
	customFields: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomField, 'value' > >
	>
): ReceiveCustomFields {
	return {
		type: 'RECEIVE_CUSTOM_FIELDS',
		customFields,
	};
} //end receiveCustomFields()

export function receiveCustomPlaceholders(
	customPlaceholders: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomPlaceholder, 'value' > >
	>
): ReceiveCustomPlaceholders {
	return {
		type: 'RECEIVE_CUSTOM_PLACEHOLDERS',
		customPlaceholders,
	};
} //end receiveCustomPlaceholders()

export function setProfileFrequencies(
	profileId: Uuid,
	frequencies: Partial< AutoFrequencies >
): SetProfileFrequencies {
	return {
		type: 'SET_PROFILE_FREQUENCIES',
		profileId,
		frequencies,
	};
}

export function markAsNetworkTemplate(
	isNetwork: boolean
): MarkAsNetworkTemplate {
	return {
		type: 'MARK_AS_NETWORK_TEMPLATE',
		isNetwork,
	};
} //end mmarkAsNetworkTemplate()

export function markAsSaving( isSaving: boolean ): MarkAsSaving {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

export function setAutomationGroupValidation(
	groupId: AutomationGroupId,
	validation: GroupValidation
): SetAutomationGroupValidation {
	return {
		type: 'SET_AUTOMATION_GROUP_VALIDATION',
		groupId,
		validation,
	};
} //end setAutomationGroupValidation()

export function setEditingTemplateAttributes(
	attributes: Partial< SocialTemplate >
): SetEditingTemplateAttributes {
	return {
		type: 'SET_EDITING_TEMPLATE_ATTRIBUTES',
		attributes,
	};
} //end setEditingTemplateAttributes()

export function setEditingTemplateErrors(
	errors: TemplateErrors
): SetEditingTemplateErrors {
	return {
		type: 'SET_EDITING_TEMPLATE_ERRORS',
		errors,
	};
} //end setEditingTemplateErrors()

// ============
// HELPER TYPES
// ============

type AddAutomationGroup = {
	readonly type: 'ADD_AUTOMATION_GROUP';
	readonly group: RegularAutomationGroup;
};

type UpdateAutomationGroup = {
	readonly type: 'UPDATE_AUTOMATION_GROUP';
	readonly groupId: AutomationGroupId;
	readonly attrs: Partial< Omit< AutomationGroup, 'id' > >;
};

type AddProfileSettings = {
	readonly type: 'ADD_PROFILE_SETTINGS';
	readonly groupId: AutomationGroupId;
	readonly settings: ProfileAutomationSettings;
};

type CloseTemplateEditor = {
	readonly type: 'CLOSE_TEMPLATE_EDITOR';
};

type CloseTemplateImportExport = {
	readonly type: 'CLOSE_TEMPLATE_IMPORT_EXPORT';
};

type DeleteAutomationGroup = {
	readonly type: 'DELETE_AUTOMATION_GROUP';
	readonly groupId: RegularAutomationGroupId;
};

type DeleteAutomationGroupTemplate = {
	readonly type: 'DELETE_AUTOMATION_GROUP_TEMPLATE';
	readonly template: SocialTemplate;
};

type InitAutomationGroups = {
	readonly type: 'INIT_AUTOMATION_GROUPS';
	readonly automationGroups: ReadonlyArray< AutomationGroup >;
	readonly profiles: ReadonlyArray< SocialProfile >;
};

type OpenTemplateEditor = {
	readonly type: 'OPEN_TEMPLATE_EDITOR';
	readonly template: EditingSocialTemplate;
	readonly isNew: boolean;
};

type OpenTemplateImporter = {
	readonly type: 'OPEN_TEMPLATE_IMPORTER';
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
	readonly templateType: 'publication' | 'reshare';
};

type OpenTemplateExporter = {
	readonly type: 'OPEN_TEMPLATE_EXPORTER';
	readonly templates: ReadonlyArray< ExportedSocialTemplate >;
};

type ReceiveAutomationGroupTemplates = {
	readonly type: 'RECEIVE_AUTOMATION_GROUP_TEMPLATES';
	readonly templateType: 'publication' | 'reshare';
	readonly templates: ReadonlyArray< SocialTemplate >;
};

type ReceiveCustomFields = {
	readonly type: 'RECEIVE_CUSTOM_FIELDS';
	readonly customFields: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomField, 'value' > >
	>;
};

type ReceiveCustomPlaceholders = {
	readonly type: 'RECEIVE_CUSTOM_PLACEHOLDERS';
	readonly customPlaceholders: Record<
		PostTypeName,
		ReadonlyArray< Omit< CustomPlaceholder, 'value' > >
	>;
};

type MarkAsNetworkTemplate = {
	readonly type: 'MARK_AS_NETWORK_TEMPLATE';
	readonly isNetwork: boolean;
};

type SetAutomationGroupValidation = {
	readonly type: 'SET_AUTOMATION_GROUP_VALIDATION';
	readonly groupId: AutomationGroupId;
	readonly validation: GroupValidation;
};

type MarkAsSaving = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};

type SetEditingTemplateAttributes = {
	readonly type: 'SET_EDITING_TEMPLATE_ATTRIBUTES';
	readonly attributes: Partial< SocialTemplate >;
};

type SetEditingTemplateErrors = {
	readonly type: 'SET_EDITING_TEMPLATE_ERRORS';
	readonly errors: TemplateErrors;
};

type SetProfileFrequencies = {
	readonly type: 'SET_PROFILE_FREQUENCIES';
	readonly profileId: Uuid;
	readonly frequencies: Partial< AutoFrequencies >;
};
