/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find, map, omit, keys, values } from 'lodash';
import type {
	AutomationGroup,
	AutomationGroupId,
	CustomField,
	CustomPlaceholder,
	Maybe,
	NetworkAutomationSettings,
	PostTypeName,
	ProfileAutomationSettings,
	SocialNetworkName,
	SocialProfile,
	SocialTemplate,
	TaxonomySlug,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type {
	AutoFrequencies,
	State,
	TemplateImporter,
	TemplateErrors,
	TemplateExporter,
} from './types';

export function getAutomationGroups(
	state: State
): State[ 'automationGroups' ][ 'allIds' ] {
	return state.automationGroups.allIds;
} //end getAutomationGroups()

export function getAutomationGroup(
	state: State,
	id: AutomationGroup[ 'id' ]
): Maybe< AutomationGroup > {
	return state.automationGroups.byId[ id ];
} //end getAutomationGroup()

export function getProfileAutomationSettings(
	state: State,
	groupId: AutomationGroupId,
	profileId: Uuid
): Maybe< ProfileAutomationSettings > {
	return find( getAutomationGroup( state, groupId )?.profileSettings, {
		profileId,
	} );
} //end getProfileAutomationSettings()

export function getNetworkAutomationSettings(
	state: State,
	groupId: AutomationGroupId,
	name: SocialNetworkName
): Maybe< NetworkAutomationSettings > {
	return find( getAutomationGroup( state, groupId )?.networkSettings, {
		name,
	} );
} //end getNetworkAutomationSettings()

export function isDirty(
	state: State,
	groups: ReadonlyArray< AutomationGroup >,
	profiles: ReadonlyArray< SocialProfile >
): boolean {
	const editingGroups = values( state.automationGroups.byId );
	const existingGroups = groups;

	const areProfilesDirty = profiles.some( ( p ) => {
		const fs = state.frequencies[ p.id ];
		return (
			fs?.publication !== Math.max( 1, p.publicationFrequency ) ||
			fs?.reshare !== Math.max( 1, p.reshareFrequency )
		);
	} );

	return (
		areProfilesDirty ||
		JSON.stringify( editingGroups ) !== JSON.stringify( existingGroups )
	);
} //end isDirty()

export function isSaving( state: State ): boolean {
	return !! state.isSaving;
} //end isSaving()

export function isEditingTemplate( state: State ): boolean {
	return !! state.templateEditor.attributes;
} //end isEditingTemplate()

export function isEditingNewTemplate( state: State ): boolean {
	return isEditingTemplate( state ) && state.templateEditor.isNew;
} //end isEditingNewTemplate()

export function isEditingNetworkTemplate( state: State ): boolean {
	return isEditingTemplate( state ) && state.templateEditor.isNetwork;
} //end isEditingNetworkTemplate()

export function getEditingTemplate( state: State ): Maybe< SocialTemplate > {
	const attrs = state.templateEditor.attributes;
	return attrs ? omit( attrs, 'type' ) : undefined;
} //end getEditingTemplate()

export function getEditingTemplateErrors( state: State ): TemplateErrors {
	return state.templateEditor.errors;
} //end getEditingTemplateErrors()

export function getEditingTemplateType(
	state: State
): 'publication' | 'reshare' {
	return state.templateEditor.attributes?.type || 'publication';
} //end getEditingTemplateType()

export function getProfileFrequencies(
	state: State,
	profileId: Uuid
): Maybe< AutoFrequencies > {
	return state.frequencies[ profileId ];
} //end getProfileFrequencies()

export function getCustomFields(
	state: State
): Record< PostTypeName, ReadonlyArray< Omit< CustomField, 'value' > > > {
	return state.templateEditor.customFields;
} //end getCustomFields()

export function getCustomPlaceholders(
	state: State
): Record< PostTypeName, ReadonlyArray< Omit< CustomPlaceholder, 'value' > > > {
	return state.templateEditor.customPlaceholders;
} //end getCustomPlaceholders()

export function isPostTypeValid(
	state: State,
	groupId: AutomationGroupId
): boolean {
	return state.validations[ groupId ]?.isPostTypeValid ?? true;
} //end isPostTypeValid()

export function areAuthorsValid(
	state: State,
	groupId: AutomationGroupId
): boolean {
	return state.validations[ groupId ]?.areAuthorsValid ?? true;
} //end areAuthorsValid()

export function getGroupTermsValidation(
	state: State,
	groupId: AutomationGroupId
): Record< TaxonomySlug, boolean > {
	return state.validations[ groupId ]?.areTermsValid || {};
} //end getTaxonomyValidation()

export function isGroupValid(
	state: State,
	groupId: AutomationGroupId
): boolean {
	const areTermsValid = values(
		getGroupTermsValidation( state, groupId )
	).every( Boolean );
	return (
		isPostTypeValid( state, groupId ) &&
		areAuthorsValid( state, groupId ) &&
		areTermsValid &&
		keys( getAutomationGroup( state, groupId )?.profileSettings ).every(
			( profileId: Uuid ) =>
				! getProfileError( state, groupId, profileId )
		)
	);
} //end isPostTypeValid()

export function getProfileError(
	state: State,
	groupId: AutomationGroupId,
	profileId: Uuid
): string | false {
	const err = state.validations[ groupId ]?.socialProfileErrors[ profileId ];
	if ( err ) {
		return err;
	} //end if

	const profileSettings = getProfileAutomationSettings(
		state,
		groupId,
		profileId
	);

	if ( ! profileSettings ) {
		return false;
	} //end if

	const networkSettings = getNetworkAutomationSettings(
		state,
		groupId,
		profileSettings.network
	);

	const isDisabled = (
		settings:
			| ProfileAutomationSettings[ 'publication' | 'reshare' ]
			| NetworkAutomationSettings[ 'publication' | 'reshare' ]
	) => 'enabled' in settings && ! settings.enabled;

	const isValid = (
		settings?:
			| ProfileAutomationSettings[ 'publication' | 'reshare' ]
			| NetworkAutomationSettings[ 'publication' | 'reshare' ]
	) =>
		! settings ||
		isDisabled( settings ) ||
		map( settings.templates, 'id' ).every( ( templateId ) =>
			isTemplateValid( state, groupId, templateId )
		);

	if (
		! isValid( profileSettings.publication ) ||
		! isValid( networkSettings?.publication )
	) {
		return _x(
			'Please review publication templates',
			'user',
			'nelio-content'
		);
	} //end if

	if (
		! isValid( profileSettings.reshare ) ||
		! isValid( networkSettings?.reshare )
	) {
		return _x( 'Please review reshare templates', 'text', 'nelio-content' );
	} //end if

	return false;
} //end getProfileError()

export function isTemplateValid(
	state: State,
	groupId: AutomationGroupId,
	templateId: Uuid
): boolean {
	const errs = state.validations[ groupId ]?.templateErrors[ templateId ];
	return (
		keys( omit( errs, 'taxonomies' ) ).every( ( k ) => ! errs?.[ k ] ) &&
		keys( errs?.taxonomies ).every( ( k ) => ! errs?.taxonomies[ k ] )
	);
} //end isTemplateValid()

export function getTemplateErrors(
	state: State,
	groupId: AutomationGroupId,
	templateId: Uuid
): Maybe< TemplateErrors > {
	return state.validations[ groupId ]?.templateErrors[ templateId ];
} //end getTemplateErrors()

export function getImportExportData(
	state: State
): Maybe< TemplateImporter | TemplateExporter > {
	return state.templateImportExport;
} //end getImportExportData()
