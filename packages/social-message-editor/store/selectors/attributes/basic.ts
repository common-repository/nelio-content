/**
 * External dependencies
 */
import type {
	Maybe,
	ReusableSocialMessageId,
	SocialMessage,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getId( state: State ): Maybe< Uuid > {
	return state.attributes.message.id;
} //end getId()

export function getStatus( state: State ): SocialMessage[ 'status' ] {
	return state.attributes.message.status;
} //end getStatus()

export function isFreePreview( state: State ): boolean {
	return !! state.attributes.message.isFreePreview;
} //end isFreePreview()

export function getFailureDescription( state: State ): string {
	return state.attributes.message.failureDescription ?? '';
} //end getFailureDescription()

export function isEditingReusableMessage( state: State ): boolean {
	return state.attributes.reusableMessage.active;
} //end isEditingReusableMessage()

export function getReusableMessageId(
	state: State
): Maybe< ReusableSocialMessageId > {
	return state.attributes.reusableMessage.id;
} //end getReusableMessageId()
