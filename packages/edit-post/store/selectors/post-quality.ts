/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { filter, size } from 'lodash';
import type {
	PostQualityStatus,
	QualityCheckName,
	QualityCheckStatus,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getPostQualitySettings(
	state: State
): State[ 'postQuality' ][ 'settings' ] {
	return state.postQuality.settings;
} //end getPostQualitySettings()

export function isQualityAnalysisFullyIntegrated( state: State ): boolean {
	return !! state.postQuality.isFullyIntegrated;
} //end isQualityAnalysisFullyIntegrated()

export function getOverallPostQualityStatus( state: State ): PostQualityStatus {
	const quality = state.postQuality.checks;
	const goodCount = size( filter( quality, { status: 'good' } ) );
	const improvableCount = size( filter( quality, { status: 'improvable' } ) );
	const badCount = size( filter( quality, { status: 'bad' } ) );

	if ( ! goodCount && ! improvableCount && ! badCount ) {
		return 'unknown';
	} //end if

	const { allowedBads } = state.postQuality.settings;
	if ( allowedBads < badCount ) {
		return 'bad';
	} //end if

	const baiCounts = badCount + improvableCount;
	const { unacceptableImprovables } = state.postQuality.settings;
	if ( unacceptableImprovables < baiCounts ) {
		return 'bad';
	} //end if

	const { allowedImprovables } = state.postQuality.settings;
	if ( badCount || allowedImprovables < baiCounts ) {
		return 'improvable';
	} //end if

	return baiCounts ? 'good' : 'perfect';
} //end getQualityCheckCounts()

export function getQualityCheckStatus(
	state: State,
	name: QualityCheckName
): QualityCheckStatus {
	const value = state.postQuality.checks[ name ];
	return value?.status || 'unknown';
} //end getQualityCheckStatus()

export function getQualityCheckRationale(
	state: State,
	name: QualityCheckName
): string {
	const value = state.postQuality.checks[ name ];
	return value?.text || _x( 'Unknown status', 'text', 'nelio-content' );
} //end getQualityCheckRationale()
