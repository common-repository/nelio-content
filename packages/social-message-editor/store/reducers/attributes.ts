/**
 * External dependencies
 */
import { trim, values, without } from 'lodash';
import {
	doesNetworkRequire,
	doesNetworkSupport,
	getSupportedNetworks,
} from '@nelio-content/networks';
import { isEmpty } from '@nelio-content/utils';
import type {
	AnyAction,
	Maybe,
	SocialMessage,
	SocialNetworkName,
	Post,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type {
	AttributeAction,
	SetSelectedTargetsInProfileAction,
} from '../actions/attributes';
import type { OpenEditorAction } from '../actions/status';

type State = FullState[ 'attributes' ];
type Action = AttributeAction | OpenEditorAction;

export function attributes(
	state = INIT_STATE.attributes,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end attributes()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return initState( action );

		case 'MAKE_EDITABLE':
			return {
				...state,
				message: {
					...state.message,
					status: 'draft',
					failureDescription: undefined,
				},
			};

		case 'SET_DATE':
			return {
				...state,
				message: {
					...state.message,
					dateType: action.dateType,
					dateValue: stringify( action.dateValue ),
					timeType: action.timeType,
					timeValue: stringify( action.timeValue ),
				},
			};

		case 'SET_TIME':
			return {
				...state,
				message: {
					...state.message,
					timeType: action.timeType,
					timeValue: stringify( action.timeValue ),
				},
			};

		case 'SWITCH_MESSAGE_TYPE':
			return {
				...state,
				typeByNetwork: {
					...state.typeByNetwork,
					[ action.network ]: action.messageType,
				},
			};

		case 'SET_IMAGE':
			return {
				...state,
				typeByNetwork: {
					...updateMessageTypes(
						state.typeByNetwork,
						'set-image',
						state.relatedPost
					),
					[ action.network ]: 'image',
				},
				message: {
					...state.message,
					image: action.imageUrl,
					imageId: action.imageId,
				},
			};

		case 'REMOVE_IMAGE':
			return {
				...state,
				typeByNetwork: updateMessageTypes(
					state.typeByNetwork,
					'remove-image',
					state.relatedPost
				),
				message: {
					...state.message,
					image: undefined,
					imageId: undefined,
				},
			};

		case 'SET_VIDEO':
			return {
				...state,
				typeByNetwork: {
					...updateMessageTypes(
						state.typeByNetwork,
						'set-video',
						state.relatedPost
					),
					[ action.network ]: 'video',
				},
				message: {
					...state.message,
					video: action.videoUrl,
					videoId: action.videoId,
				},
			};

		case 'REMOVE_VIDEO':
			return {
				...state,
				typeByNetwork: updateMessageTypes(
					state.typeByNetwork,
					'remove-video',
					state.relatedPost
				),
				message: {
					...state.message,
					video: undefined,
					videoId: undefined,
				},
			};

		case 'SET_POST':
			if ( ! action.post ) {
				return {
					...state,
					relatedPost: undefined,
					typeByNetwork: updateMessageTypes(
						state.typeByNetwork,
						'update-post',
						undefined
					),
				};
			} //end if

			return {
				...state,
				relatedPost: action.post,
				typeByNetwork: updateMessageTypes(
					state.typeByNetwork,
					'update-post',
					action.post
				),
				message: {
					...state.message,
					text: addDefaultPlaceholdersInText( state.message.text ),
				},
			};

		case 'SELECT_SINGLE_SOCIAL_PROFILE':
			return {
				...state,
				profileIds: {
					all: [ action.profileId ],
					byNetwork: {
						[ action.network ]: [ action.profileId ],
					},
				},
				targetNamesByProfile: {},
			};

		case 'SELECT_SOCIAL_PROFILE':
			const profilesInNetwork =
				state.profileIds.byNetwork[ action.network ] || [];
			return {
				...state,
				profileIds: {
					all: action.isSelected
						? [ ...state.profileIds.all, action.profileId ]
						: without( state.profileIds.all, action.profileId ),
					byNetwork: {
						...state.profileIds.byNetwork,
						[ action.network ]: action.isSelected
							? [ ...profilesInNetwork, action.profileId ]
							: without( profilesInNetwork, action.profileId ),
					},
				},
			};

		case 'SELECT_SINGLE_TARGET':
			return {
				...state,
				profileIds: {
					all: [ action.profileId ],
					byNetwork: {
						[ action.network ]: [ action.profileId ],
					},
				},
				targetNamesByProfile: {
					[ action.profileId ]: [ action.targetName ],
				},
			};

		case 'SET_SELECTED_TARGETS_IN_PROFILE':
			return updateStateWithNewTargetSelection( state, action );

		case 'SET_TEXT':
			return {
				...state,
				message: {
					...state.message,
					text: action.text || '',
				},
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function initState( {
	message,
	reusableMessage,
	post,
}: OpenEditorAction ): State {
	const isNewMessage = ! message.id;
	return {
		typeByNetwork: initTypesByNetwork( message.type, post ),
		message: {
			id: ! isNewMessage ? message.id : undefined,
			dateType: message.dateType,
			dateValue: stringify( message.dateValue ),
			timeType: message.timeType,
			timeValue: stringify( message.timeValue ),
			image: message.image,
			imageId: message.imageId,
			video: message.video,
			videoId: message.videoId,
			text:
				isNewMessage && post
					? addDefaultPlaceholdersInText( message.text )
					: message.text,
			status: message.status,
			isFreePreview: !! message.isFreePreview,
			failureDescription: message.failureDescription,
		},
		relatedPost: post,
		reusableMessage,
		profileIds:
			message.profileId && message.network
				? {
						all: [ message.profileId ],
						byNetwork: {
							[ message.network ]: [ message.profileId ],
						},
				  }
				: INIT_STATE.attributes.profileIds,
		targetNamesByProfile:
			message.profileId &&
			message.network &&
			message.targetName &&
			doesNetworkSupport( 'multi-target', message.network )
				? {
						[ message.profileId ]: [ message.targetName ],
				  }
				: INIT_STATE.attributes.targetNamesByProfile,
	};
} //end initState()

function updateStateWithNewTargetSelection(
	state: State,
	action: SetSelectedTargetsInProfileAction
): State {
	const { selectedTargetNames, profileId, network } = action;

	const profileIdsWithAction = state.profileIds.all.includes( profileId )
		? state.profileIds.all
		: [ ...state.profileIds.all, profileId ];

	const networkProfileIds = state.profileIds.byNetwork[ network ] || [];
	const networkProfileIdsWithAction = networkProfileIds.includes( profileId )
		? networkProfileIds
		: [ ...networkProfileIds, profileId ];

	const hasSelectedTargets = ! isEmpty( selectedTargetNames );

	return {
		...state,
		profileIds: {
			all: hasSelectedTargets
				? profileIdsWithAction
				: without( profileIdsWithAction, profileId ),
			byNetwork: {
				...state.profileIds.byNetwork,
				[ network ]: hasSelectedTargets
					? networkProfileIdsWithAction
					: without( networkProfileIdsWithAction, profileId ),
			},
		},
		targetNamesByProfile: {
			...state.targetNamesByProfile,
			[ profileId ]: action.selectedTargetNames,
		},
	};
} //end updateStateWithNewTargetSelection()

function addDefaultPlaceholdersInText( text = '' ) {
	return isEmpty( trim( text ) ) ? '{title} {permalink}' : text;
} //end addDefaultPlaceholdersInText()

function stringify( value?: string ) {
	return undefined === value ? '' : `${ value }`;
} //end stringify()

function initTypesByNetwork(
	type: SocialMessage[ 'type' ],
	post?: Post
): State[ 'typeByNetwork' ] {
	const init = updateMessageTypes(
		INIT_STATE.attributes.typeByNetwork,
		'update-post',
		post
	);
	switch ( type ) {
		case 'image':
			return updateMessageTypes( init, 'set-image', post );
		case 'video':
			return updateMessageTypes( init, 'set-video', post );
		case 'auto-image':
		case 'text':
			return init;
	} //end switch
} //end initTypesByNetwork()

function updateMessageTypes(
	typeByNetwork: State[ 'typeByNetwork' ],
	mode:
		| 'set-image'
		| 'remove-image'
		| 'set-video'
		| 'remove-video'
		| 'update-post',
	post: Maybe< Post >
): State[ 'typeByNetwork' ] {
	typeByNetwork = autoToText( typeByNetwork );

	switch ( mode ) {
		case 'set-image':
			typeByNetwork = textToType( 'image', typeByNetwork );
			break;

		case 'remove-image':
			typeByNetwork = typeToText( 'image', typeByNetwork );
			break;

		case 'set-video':
			typeByNetwork = textToType( 'video', typeByNetwork );
			break;

		case 'remove-video':
			typeByNetwork = typeToText( 'video', typeByNetwork );
			break;
	} //end switch

	return textToAuto( typeByNetwork, post );
} //end updateMessageTypes()

function autoToText(
	typeByNetwork: State[ 'typeByNetwork' ]
): State[ 'typeByNetwork' ] {
	const networks = getSupportedNetworks();
	return networks.reduce(
		( tbn, n ) => ( {
			...tbn,
			[ n ]: tbn[ n ] === 'auto-image' ? 'text' : tbn[ n ],
		} ),
		typeByNetwork
	);
} //end autoToText()

function textToType(
	newType: 'image' | 'video',
	typeByNetwork: State[ 'typeByNetwork' ]
): State[ 'typeByNetwork' ] {
	const networks = getSupportedNetworks();
	return networks.reduce(
		( tbn, n ) => ( {
			...tbn,
			[ n ]:
				tbn[ n ] === 'text' && doesNetworkSupport( newType, n )
					? newType
					: tbn[ n ],
		} ),
		typeByNetwork
	);
} //end textToType()

function typeToText(
	oldType: 'image' | 'video',
	typeByNetwork: State[ 'typeByNetwork' ]
): State[ 'typeByNetwork' ] {
	const networks = getSupportedNetworks();
	return networks.reduce(
		( tbn, n ) => ( {
			...tbn,
			[ n ]: tbn[ n ] === oldType ? 'text' : tbn[ n ],
		} ),
		typeByNetwork
	);
} //end typeToText()

function textToAuto(
	typeByNetwork: State[ 'typeByNetwork' ],
	post: Maybe< Post >
): State[ 'typeByNetwork' ] {
	const types = values( typeByNetwork );
	const hasAutoImage = !! post?.imageSrc || !! post?.images[ 0 ];
	const hasImage = types.includes( 'image' );
	const hasVideo = types.includes( 'video' );

	const setType = ( n: SocialNetworkName, t: SocialMessage[ 'type' ] ) => {
		if ( 'text' !== t ) {
			return t;
		} //end if
		if ( hasImage && doesNetworkSupport( 'image', n ) ) {
			return 'image';
		} //end if
		if ( hasVideo && doesNetworkSupport( 'video', n ) ) {
			return 'video';
		} //end if
		if ( hasAutoImage && doesNetworkRequire( 'image', n ) ) {
			return 'auto-image';
		} //end if
		return 'text';
	};

	const networks = getSupportedNetworks();
	return networks.reduce(
		( tbn, n ) => ( {
			...tbn,
			[ n ]: setType( n, tbn[ n ] ),
		} ),
		typeByNetwork
	);
} //end textToAuto()
