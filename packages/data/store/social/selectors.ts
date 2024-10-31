/**
 * External dependencies
 */
import {
	difference,
	filter,
	find,
	map,
	mapValues,
	omit,
	pick,
	uniq,
	values,
} from 'lodash';
import type {
	AutomationGroup,
	Maybe,
	Post,
	PostId,
	RegularAutomationGroup,
	SocialMessage,
	SocialNetworkName,
	SocialProfile,
	SocialProfileTarget,
	SocialTargetName,
	SocialTemplate,
	UniversalAutomationGroup,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	getSocialMessage,
	getSocialMessagesRelatedToPost,
} from '../entities/messages/selectors';
import type { State } from '../config';

export function getResetStatus(
	state: State
): State[ 'social' ][ 'resetStatus' ] {
	return state.social.resetStatus;
} //end getResetStatus()

export function getTargetsInProfile(
	state: State,
	profileId: Uuid
): Maybe< ReadonlyArray< SocialProfileTarget > > {
	return state.social.targets[ profileId ];
} //end getTargetsInProfile()

export function getProfileTarget(
	state: State,
	profileId: Uuid,
	targetName: SocialTargetName
): Maybe< SocialProfileTarget > {
	const targets = getTargetsInProfile( state, profileId ) || [];
	return find( targets, { name: targetName } );
} //end getProfileTarget()

export function getAutomationGroups(
	state: State
): State[ 'social' ][ 'automationGroups' ][ 'allIds' ] {
	return state.social.automationGroups.allIds;
} //end getAutomationGroups()

export function getAutomationGroup(
	state: State,
	id: AutomationGroup[ 'id' ]
): Maybe< AutomationGroup > {
	return state.social.automationGroups.byId[ id ];
} //end getAutomationGroup()

export function getPostAutomationGroups(
	state: State,
	post?: Maybe< Post >
): readonly [ UniversalAutomationGroup, ...RegularAutomationGroup[] ] {
	const allRegularGroups = values(
		omit( state.social.automationGroups.byId, 'universal' )
	);
	const regularGroups = allRegularGroups.filter(
		( group ) =>
			!! post &&
			group.postType === post.type &&
			( ! group.authors.length ||
				group.authors.includes( post.author ) ) &&
			values(
				mapValues(
					post.taxonomies,
					( terms, tax ) =>
						! group.taxonomies[ tax ]?.length ||
						terms.some(
							( { id } ) =>
								!! group.taxonomies[ tax ]?.includes( id )
						)
				)
			).every( Boolean )
	);

	return [
		getAutomationGroup( state, 'universal' ) as UniversalAutomationGroup,
		...regularGroups,
	];
} //end getPostAutomationGroups()

export function getSocialTemplates(
	state: State,
	post?: Maybe< Post >
): ReadonlyArray< SocialTemplate > {
	const groups = post
		? getPostAutomationGroups( state, post )
		: getAllAutomationGroups( state );

	return groups
		.filter( ( group ) => !! group.priority )
		.flatMap( ( group ): ReadonlyArray< SocialTemplate > => {
			const profileSettings = values( group.profileSettings ).filter(
				( ps ) => ps.enabled
			);

			const pubProfSettings = profileSettings.filter(
				( ps ) => ps.publication.enabled
			);
			const resProfSettings = profileSettings.filter(
				( ps ) => ps.reshare.enabled
			);

			const pubNetworks = map( pubProfSettings, 'network' );
			const resNetworks = map( resProfSettings, 'network' );

			const pubNetworkSettings = values(
				pick( group.networkSettings, pubNetworks )
			);
			const resNetworkSettings = values(
				pick( group.networkSettings, resNetworks )
			);

			return [
				...pubProfSettings.flatMap(
					( ps ) => ps.publication.templates
				),
				...resProfSettings.flatMap( ( ps ) => ps.reshare.templates ),
				...pubNetworkSettings.flatMap(
					( ns ) => ns.publication.templates
				),
				...resNetworkSettings.flatMap( ( ns ) => ns.reshare.templates ),
			].filter(
				( t ) => ! t.postType || ! post || t.postType === post.type
			);
		} );
} //end getSocialTemplates()

export function getSocialTemplate(
	state: State,
	id: Uuid
): Maybe< SocialTemplate > {
	return find( getSocialTemplates( state ), { id } );
} //end getSocialTemplate()

// =======
// HELPERS
// =======

function getAllAutomationGroups(
	state: State
): readonly [ UniversalAutomationGroup, ...RegularAutomationGroup[] ] {
	const regularGroups = values(
		omit( state.social.automationGroups.byId, 'universal' )
	);
	return [
		getAutomationGroup( state, 'universal' ) as UniversalAutomationGroup,
		...regularGroups,
	];
} //end getAllAutomationGroups()

export function getSocialProfileCount( state: State ): number {
	return getSocialProfileIds( state ).length;
} //end getSocialProfileCount()

export function getSocialProfiles(
	state: State
): ReadonlyArray< SocialProfile > {
	return values( state.social.profiles.byId );
} //end getSocialProfiles()

export function getSocialProfileIds( state: State ): ReadonlyArray< Uuid > {
	return state.social.profiles.allIds;
} //end getSocialProfileIds()

export function getAvailableSocialNetworks(
	state: State
): ReadonlyArray< SocialNetworkName > {
	const profiles = getSocialProfiles( state );
	const networks = uniq( map( profiles, 'network' ) );
	return uniq(
		filter(
			[
				networks.includes( 'twitter' ) && 'twitter',
				networks.includes( 'facebook' ) && 'facebook',
				networks.includes( 'linkedin' ) && 'linkedin',
				...networks.sort(),
			],
			( x ): x is SocialNetworkName => !! x
		)
	);
} //end getAvailableSocialNetworks()

export function getSocialProfilesByNetwork(
	state: State,
	network: SocialNetworkName
): ReadonlyArray< SocialProfile > {
	const profiles = getSocialProfiles( state );
	return filter( profiles, { network } );
} //end getSocialProfilesByNetwork()

export function getSocialProfile(
	state: State,
	profileId: Uuid
): Maybe< SocialProfile > {
	return state.social.profiles.byId[ profileId ];
} //end getSocialProfile()

export function getProfilesWithMessagesRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< Uuid > {
	const messageIds = map(
		getSocialMessagesRelatedToPost( state, postId ),
		'id'
	);
	const messages = filter(
		map( messageIds, ( id ) => getSocialMessage( state, id ) ),
		( m ): m is SocialMessage => !! m && ! m.isFreePreview
	);

	return uniq( map( messages, 'profileId' ) );
} //end getProfilesWithMessagesRelatedToPost()

export function getProfilesWithoutMessagesRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< Uuid > {
	const profiles = getSocialProfileIds( state );
	const fullProfiles = getProfilesWithMessagesRelatedToPost( state, postId );
	return difference( profiles, fullProfiles );
} //end getProfilesWithoutMessagesRelatedToPost()
