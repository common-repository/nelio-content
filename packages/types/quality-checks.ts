/**
 * WordPress dependencies
 */
import type { Dashicon } from '@safe-wordpress/components';
import type { select as _select } from '@safe-wordpress/data';

type Select = typeof _select;

/**
 * Internal dependencies
 */
import type { Dict } from './utils';

export type PostQualityStatus = QualityCheckStatus | 'perfect';

export type QualityCheckName = string;

export type QualityCheckStatus =
	| 'unknown'
	| 'bad'
	| 'improvable'
	| 'good'
	| 'invisible';

export type QualityCheckResult = {
	readonly status: QualityCheckStatus;
	readonly text: string;
};

export type QualityCheckType< A extends Dict = Dict, S extends Dict = Dict > = {
	readonly name: QualityCheckName;
	readonly icon: Dashicon.Props[ 'icon' ];
	readonly interval: number;
	readonly settings: S;
	readonly attributes: ( select: Select ) => A;
	readonly validate: ( attrs: A, settings: S ) => QualityCheckResult;
};
