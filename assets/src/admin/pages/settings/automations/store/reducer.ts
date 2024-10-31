/**
 * External dependencies
 */
import {
	filter,
	isEqual,
	isNil,
	keyBy,
	keys,
	map,
	mapValues,
	omit,
	omitBy,
	reduce,
	uniqWith,
	values,
	without,
} from 'lodash';
import { fixAttributesInGroup } from '@nelio-content/utils';
import type {
	AnyAction,
	NetworkAutomationSettings,
	ProfileAutomationSettings,
	RegularAutomationGroupId,
	SocialTemplate,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './types';
import type { Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_AUTOMATION_GROUP': {
			if ( state.automationGroups.byId[ action.group.id ] ) {
				return state;
			} //end if

			const groups: State[ 'automationGroups' ][ 'byId' ] = {
				...state.automationGroups.byId,
				[ action.group.id ]: action.group,
			};

			return fixAttributesInAllGroups( {
				...state,
				automationGroups: {
					byId: groups,
					allIds: [
						'universal',
						...keys( groups ).filter(
							( x ): x is RegularAutomationGroupId =>
								'universal' !== x
						),
					],
				},
			} );
		}

		case 'UPDATE_AUTOMATION_GROUP': {
			if ( ! state.automationGroups.byId[ action.groupId ] ) {
				return state;
			} //end if

			if ( action.groupId === 'universal' ) {
				return fixAttributesInAllGroups( {
					...state,
					automationGroups: {
						...state.automationGroups,
						byId: {
							...state.automationGroups.byId,
							universal: {
								...state.automationGroups.byId.universal,
								...action.attrs,
							},
						},
					},
				} );
			} //end if

			return fixAttributesInAllGroups( {
				...state,
				automationGroups: {
					...state.automationGroups,
					byId: {
						...state.automationGroups.byId,
						[ action.groupId ]: {
							...state.automationGroups.byId[ action.groupId ],
							...action.attrs,
						},
					},
				},
			} );
		}

		case 'ADD_PROFILE_SETTINGS': {
			const group = state.automationGroups.byId[ action.groupId ];
			if ( ! group ) {
				return state;
			} //end if

			const updatedGroup = {
				...group,
				profileSettings: {
					...group.profileSettings,
					[ action.settings.profileId ]: action.settings,
				},
			};

			return fixAttributesInAllGroups( {
				...state,
				automationGroups: {
					...state.automationGroups,
					byId: {
						...state.automationGroups.byId,
						[ updatedGroup.id ]: updatedGroup,
					},
				},
			} );
		}

		case 'CLOSE_TEMPLATE_EDITOR':
			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					attributes: undefined,
					isNew: false,
				},
			};

		case 'CLOSE_TEMPLATE_IMPORT_EXPORT':
			return {
				...state,
				templateImportExport: undefined,
			};

		case 'DELETE_AUTOMATION_GROUP':
			if ( ! state.automationGroups.allIds.includes( action.groupId ) ) {
				return state;
			} //end if

			return {
				...state,
				automationGroups: {
					byId: omit( state.automationGroups.byId, action.groupId ),
					allIds: [
						'universal',
						...without(
							filter(
								state.automationGroups.allIds,
								( x ): x is RegularAutomationGroupId =>
									x !== 'universal'
							),
							action.groupId
						),
					],
				},
			};

		case 'DELETE_AUTOMATION_GROUP_TEMPLATE':
			return fixAttributesInAllGroups(
				deleteAutomationGroupTemplate( state, action.template )
			);

		case 'INIT_AUTOMATION_GROUPS':
			return fixAttributesInAllGroups( {
				...state,
				automationGroups: {
					byId: {
						universal: state.automationGroups.byId.universal,
						...keyBy( action.automationGroups, 'id' ),
					},
					allIds: [
						'universal',
						...map( action.automationGroups, 'id' ).filter(
							( x ): x is RegularAutomationGroupId =>
								x !== 'universal'
						),
					],
				},
				frequencies: mapValues(
					keyBy( action.profiles, 'id' ),
					( p ) => ( {
						publication: Math.max( 1, p.publicationFrequency ),
						reshare: Math.max( 1, p.reshareFrequency ),
					} )
				),
			} );

		case 'OPEN_TEMPLATE_EDITOR':
			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					attributes: action.template,
					isNew: action.isNew,
					isNetwork: ! action.isNew && ! action.template.profileId,
				},
			};

		case 'OPEN_TEMPLATE_IMPORTER':
			return {
				...state,
				templateImportExport: {
					mode: 'import',
					...omit( action, 'type' ),
				},
			};

		case 'OPEN_TEMPLATE_EXPORTER':
			return {
				...state,
				templateImportExport: {
					mode: 'export',
					...omit( action, 'type' ),
				},
			};

		case 'MARK_AS_NETWORK_TEMPLATE':
			if ( ! state.templateEditor.attributes ) {
				return state;
			} //end if

			if ( ! state.templateEditor.isNew ) {
				return state;
			} //end if

			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					isNetwork: action.isNetwork,
				},
			};

		case 'MARK_AS_SAVING':
			return {
				...state,
				isSaving: action.isSaving,
			};

		case 'RECEIVE_AUTOMATION_GROUP_TEMPLATES':
			return reduce(
				action.templates,
				receiveTemplate( action.templateType ),
				state
			);

		case 'RECEIVE_CUSTOM_FIELDS':
			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					customFields: action.customFields,
				},
			};

		case 'RECEIVE_CUSTOM_PLACEHOLDERS':
			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					customPlaceholders: action.customPlaceholders,
				},
			};

		case 'SET_PROFILE_FREQUENCIES': {
			const frequencies = state.frequencies[ action.profileId ];
			if ( ! frequencies ) {
				return state;
			} //end if

			return {
				...state,
				frequencies: {
					...state.frequencies,
					[ action.profileId ]: {
						...frequencies,
						...action.frequencies,
					},
				},
			};
		}

		case 'SET_AUTOMATION_GROUP_VALIDATION':
			return {
				...state,
				validations: {
					...state.validations,
					[ action.groupId ]: action.validation,
				},
			};

		case 'SET_EDITING_TEMPLATE_ATTRIBUTES':
			if ( ! state.templateEditor.attributes ) {
				return state;
			} //end if

			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					attributes: {
						...state.templateEditor.attributes,
						...action.attributes,
					},
				},
			};

		case 'SET_EDITING_TEMPLATE_ERRORS':
			if ( ! state.templateEditor.attributes ) {
				return state;
			} //end if

			return {
				...state,
				templateEditor: {
					...state.templateEditor,
					errors: action.errors,
				},
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

const receiveTemplate =
	( templateType: 'publication' | 'reshare' ) =>
	( state: State, template: SocialTemplate ): State => {
		const target = template.profileId ?? template.network;

		const group = state.automationGroups.byId[ template.groupId ];
		if ( ! group ) {
			return state;
		} //end if

		const allSettings:
			| Record< string, ProfileAutomationSettings >
			| Record< string, NetworkAutomationSettings > = template.profileId
			? group.profileSettings
			: group.networkSettings;

		const settings = allSettings[ target ];
		if ( ! settings ) {
			return state;
		} //end if

		const templates = settings[ templateType ].templates;
		return {
			...state,
			automationGroups: {
				...state.automationGroups,
				byId: {
					...state.automationGroups.byId,
					[ template.groupId ]: {
						...group,
						[ template.profileId
							? 'profileSettings'
							: 'networkSettings' ]: {
							...allSettings,
							[ target ]: {
								...settings,
								[ templateType ]: {
									...settings[ templateType ],
									templates: uniqWith(
										values( {
											...keyBy( templates, 'id' ),
											[ template.id ]: template,
										} ),
										areEqualTemplates
									),
								},
							},
						},
					},
				},
			},
		};
	};

function areEqualTemplates( a: SocialTemplate, b: SocialTemplate ): boolean {
	return isEqual(
		omit( omitBy( a, isNil ), [ 'groupId', 'id', 'creatorId' ] ),
		omit( omitBy( b, isNil ), [ 'groupId', 'id', 'creatorId' ] )
	);
}

function fixAttributesInAllGroups( state: State ): State {
	const groups = state.automationGroups.byId;
	return {
		...state,
		automationGroups: {
			...state.automationGroups,
			byId: {
				universal: fixAttributesInGroup( groups.universal ),
				...mapValues(
					omit( groups, 'universal' ),
					fixAttributesInGroup
				),
			},
		},
	};
} //end fixAttributesInAllGroups()

function deleteAutomationGroupTemplate(
	state: State,
	template: SocialTemplate
): State {
	const group = state.automationGroups.byId[ template.groupId ];
	if ( ! group ) {
		return state;
	} //end if

	const settingsMode = template.profileId
		? ( 'profileSettings' as const )
		: ( 'networkSettings' as const );
	const settingsKey = template.profileId ?? template.network;
	const settings = template.profileId
		? group.profileSettings[ template.profileId ]
		: group.networkSettings[ template.network ];

	if ( ! settings ) {
		return state;
	} //end if

	return {
		...state,
		automationGroups: {
			...state.automationGroups,
			byId: {
				...state.automationGroups.byId,
				[ template.groupId ]: {
					...group,
					[ settingsMode ]: {
						...group[ settingsMode ],
						[ settingsKey ]: {
							...settings,
							publication: {
								...settings.publication,
								templates:
									settings.publication.templates.filter(
										( t ) => t.id !== template.id
									),
							},
							reshare: {
								...settings.reshare,
								templates: settings.reshare.templates.filter(
									( t ) => t.id !== template.id
								),
							},
						},
					},
				},
			},
		},
	};
} //end deleteAutomationGroupTemplate()
