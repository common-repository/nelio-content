/**
 * Internal dependencies
 */
import type { QualityCheckName, QualityCheckType } from '@nelio-content/types';

export type QualityCheckTypesAction =
	| AddQualityCheckTypeAction
	| RemoveQualityCheckTypeAction
	| UpdateQualityCheckSettingsAction;

export function addQualityCheckType(
	definition: QualityCheckType
): AddQualityCheckTypeAction {
	return {
		type: 'ADD_QUALITY_CHECK_TYPE',
		definition,
	};
} //end addQualityCheckType()

export function removeQualityCheckType(
	name: QualityCheckName
): RemoveQualityCheckTypeAction {
	return {
		type: 'REMOVE_QUALITY_CHECK_TYPE',
		name,
	};
} //end removeQualityCheckType()

export function updateQualityCheckSettings(
	name: QualityCheckName,
	settings: QualityCheckType[ 'settings' ]
): UpdateQualityCheckSettingsAction {
	return {
		type: 'UPDATE_QUALITY_CHECK_SETTINGS',
		name,
		settings,
	};
} //end updateQualityCheckSettings()

// ============
// HELPER TYPES
// ============

type AddQualityCheckTypeAction = {
	readonly type: 'ADD_QUALITY_CHECK_TYPE';
	readonly definition: QualityCheckType;
};

type RemoveQualityCheckTypeAction = {
	readonly type: 'REMOVE_QUALITY_CHECK_TYPE';
	readonly name: QualityCheckName;
};

type UpdateQualityCheckSettingsAction = {
	readonly type: 'UPDATE_QUALITY_CHECK_SETTINGS';
	readonly name: QualityCheckName;
	readonly settings: QualityCheckType[ 'settings' ];
};
