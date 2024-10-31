/**
 * External dependencies
 */
import type { SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getDateType( state: State ): SocialMessage[ 'dateType' ] {
	return state.attributes.message.dateType;
} //end getDateType()

export function getDateValue( state: State ): SocialMessage[ 'dateValue' ] {
	return state.attributes.message.dateValue;
} //end getDateValue()

export function getTimeType( state: State ): SocialMessage[ 'timeType' ] {
	return state.attributes.message.timeType;
} //end getTimeType()

export function getTimeValue( state: State ): SocialMessage[ 'timeValue' ] {
	return state.attributes.message.timeValue;
} //end getTimeValue()
