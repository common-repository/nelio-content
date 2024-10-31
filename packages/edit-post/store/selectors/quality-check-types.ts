/**
 * WordPress dependencies
 */
import { values } from 'lodash';

/**
 * External dependencies
 */
import type {
	Maybe,
	QualityCheckName,
	QualityCheckType,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getQualityCheckTypes(
	state: State
): ReadonlyArray< QualityCheckType > {
	return values( state.qualityCheckTypes );
} //end getQualityCheckTypes()

export function getQualityCheckType(
	state: State,
	name: QualityCheckName
): Maybe< QualityCheckType > {
	return state.qualityCheckTypes[ name ];
} //end getQualityCheckType()
