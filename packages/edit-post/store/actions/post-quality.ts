/**
 * External dependencies
 */
import type {
	QualityCheckName,
	QualityCheckStatus,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export type PostQualityAction =
	| MarkQualityAnalysisAsFullyIntegratedAction
	| SetPostQualitySettingsAction
	| UpdateQualityCheckItemAction;

export function markQualityAnalysisAsFullyIntegrated(
	isFullyIntegrated: boolean
): MarkQualityAnalysisAsFullyIntegratedAction {
	return {
		type: 'MARK_QUALITY_ANALYSIS_AS_FULLY_INTEGRATED',
		isFullyIntegrated,
	};
} //end markQualityAnalysisAsFullyIntegrated()

export function setPostQualitySettings(
	settings: Partial< Settings >
): SetPostQualitySettingsAction {
	return {
		type: 'SET_POST_QUALITY_SETTINGS',
		settings,
	};
} //end setPostQualitySettings()

export function updateQualityCheckItem(
	name: QualityCheckName,
	status: QualityCheckStatus,
	text: string
): UpdateQualityCheckItemAction {
	return {
		type: 'UPDATE_QUALITY_CHECK_ITEM',
		name,
		status,
		text,
	};
} //end updateQualityCheckItem()

// ============
// HELPER TYPES
// ============

type MarkQualityAnalysisAsFullyIntegratedAction = {
	readonly type: 'MARK_QUALITY_ANALYSIS_AS_FULLY_INTEGRATED';
	readonly isFullyIntegrated: boolean;
};

type SetPostQualitySettingsAction = {
	readonly type: 'SET_POST_QUALITY_SETTINGS';
	readonly settings: Partial< Settings >;
};

type UpdateQualityCheckItemAction = {
	readonly type: 'UPDATE_QUALITY_CHECK_ITEM';
	readonly name: QualityCheckName;
	readonly status: QualityCheckStatus;
	readonly text: string;
};

type Settings = State[ 'postQuality' ][ 'settings' ];
