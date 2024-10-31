/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	SocialProfile,
	SocialProfileTarget,
	AutomationGroup,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies.
 */
import type { State } from './config';

export type SocialAction =
	| ReceiveProfileTargetsAction
	| ReceiveSocialProfilesAction
	| RemoveSocialProfileAction
	| ResetAutomationGroupsAction
	| ResetStatusAction;

export function receiveSocialProfiles(
	profiles: SocialProfile | ReadonlyArray< SocialProfile >
): ReceiveSocialProfilesAction {
	return {
		type: 'RECEIVE_SOCIAL_PROFILES',
		profiles: castArray( profiles ),
	};
} //end receiveSocialProfiles()

export function removeSocialProfile(
	profileId: Uuid
): RemoveSocialProfileAction {
	return {
		type: 'REMOVE_SOCIAL_PROFILE',
		profileId,
	};
} //end removeSocialProfile()

export function receiveProfileTargets(
	profileId: Uuid,
	targets: ReadonlyArray< SocialProfileTarget >
): ReceiveProfileTargetsAction {
	return {
		type: 'RECEIVE_PROFILE_TARGETS',
		profileId,
		targets,
	};
} //end receiveProfileTargets()

export function resetAutomationGroups(
	automationGroups: ReadonlyArray< AutomationGroup >
): ResetAutomationGroupsAction {
	return {
		type: 'RESET_AUTOMATION_GROUPS',
		automationGroups,
	};
} //end receiveSocialTemplates()

export function setResetStatus(
	status: State[ 'resetStatus' ]
): ResetStatusAction {
	return {
		type: 'SET_RESET_STATUS',
		status,
	};
} //end setResetStatus()

// ============
// HELPER TYPES
// ============

export type ReceiveSocialProfilesAction = {
	readonly type: 'RECEIVE_SOCIAL_PROFILES';
	readonly profiles: ReadonlyArray< SocialProfile >;
};

export type RemoveSocialProfileAction = {
	readonly type: 'REMOVE_SOCIAL_PROFILE';
	readonly profileId: Uuid;
};

type ReceiveProfileTargetsAction = {
	readonly type: 'RECEIVE_PROFILE_TARGETS';
	readonly profileId: Uuid;
	readonly targets: ReadonlyArray< SocialProfileTarget >;
};

type ResetAutomationGroupsAction = {
	readonly type: 'RESET_AUTOMATION_GROUPS';
	readonly automationGroups: ReadonlyArray< AutomationGroup >;
};

type ResetStatusAction = {
	readonly type: 'SET_RESET_STATUS';
	readonly status: State[ 'resetStatus' ];
};
