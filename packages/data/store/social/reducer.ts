/**
 * External dependencies
 */
import {
	map,
	sortBy,
	keys,
	keyBy,
	mapValues,
	omit,
	values,
	without,
} from 'lodash';
import { fixAttributesInGroup } from '@nelio-content/utils';
import type {
	AnyAction,
	SocialProfile,
	RegularAutomationGroupId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { SocialAction as Action } from './actions';
import type { State } from './config';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_SOCIAL_PROFILES': {
			const fullProfiles = map(
				action.profiles,
				( profile: PartialSocialProfile ): SocialProfile => ( {
					publicationFrequency: 0,
					reshareFrequency: 0,
					...profile,
				} )
			);

			const sortedProfiles = sortProfiles(
				values( {
					...state.profiles.byId,
					...keyBy( fullProfiles, 'id' ),
				} )
			);

			return {
				...state,
				profiles: {
					byId: keyBy( sortedProfiles, 'id' ),
					allIds: map( sortedProfiles, 'id' ),
				},
			};
		}

		case 'REMOVE_SOCIAL_PROFILE':
			return {
				...state,
				profiles: {
					byId: omit( state.profiles.byId, action.profileId ),
					allIds: without( state.profiles.allIds, action.profileId ),
				},
				targets: omit( state.targets, action.profileId ),
			};

		case 'RECEIVE_PROFILE_TARGETS':
			return {
				...state,
				targets: {
					...state.targets,
					[ action.profileId ]: action.targets,
				},
			};

		case 'RESET_AUTOMATION_GROUPS': {
			const groups = keyBy( action.automationGroups, 'id' );
			return fixAttributesInAllGroups( {
				...state,
				automationGroups: {
					byId: {
						universal: state.automationGroups.byId.universal,
						...groups,
					},
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

		case 'SET_RESET_STATUS':
			return {
				...state,
				resetStatus: action.status,
			};
	} //end switch
} //end actualReducer()

// ============
// HELPER TYPES
// ============

type PartialSocialProfile = Omit<
	SocialProfile,
	'publicationFrequency' | 'reshareFrequency'
> & {
	readonly publicationFrequency?: number;
	readonly reshareFrequency?: number;
};

// =======
// HELPERS
// =======

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

function sortProfiles( ps: ReadonlyArray< SocialProfile > = [] ) {
	ps = map( ps, ( p ) => ( {
		...p,
		_sort: getSortingValue( p ),
	} ) );

	ps = sortBy( ps, '_sort' ) as typeof ps;
	ps = map( ps, ( p ) => omit( p, '_sort' ) );

	return ps;
} //end sortProfiles()

function getSortingValue( profile: SocialProfile ): string {
	let value = '';

	if ( 'twitter' === profile.network ) {
		value += 'a';
	} else if ( 'facebook' === profile.network ) {
		value += 'b';
	} else {
		value += 'c' + profile.network;
	} //end if

	value += ':' + profile.displayName;

	return value;
} //end getSortingValue()
