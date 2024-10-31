/**
 * Internal dependencies
 */
import type { FilterCriteria } from './types';

export function stringifyCriteria( criteria: FilterCriteria ): string {
	const {
		sortBy,
		author = 'nc-all-authors',
		postType = 'nc-all-types',
		periodMode,
		periodValue,
	} = criteria;

	const period =
		'custom' === periodMode
			? `${ periodValue.from }>${ periodValue.to }`
			: periodMode;

	return `${ sortBy },${ period },${ author },${ postType }`;
} //end stringifyCriteria()
