/**
 * Internal dependencies
 */
import type { Period, UpdatingItemSummary } from './config';
import type { Timeout } from '../types';

export type StatusAction =
	| MarkPeriodAsLoadingAction
	| MarkPeriodAsLoadedAction
	| MarkAsUpdatingAction
	| MarkAsUpdatedAction
	| SetLoaderTimeoutAction;

export function markPeriodAsLoading(
	firstDay: string,
	lastDay: string
): MarkPeriodAsLoadingAction {
	return {
		type: 'MARK_PERIOD_AS_LOADING',
		period: {
			type: 'period',
			id: `${ firstDay }::${ lastDay }`,
			firstDay,
			lastDay,
		},
	};
} //end markPeriodAsLoading()

export function markPeriodAsLoaded(
	firstDay: string,
	lastDay: string
): MarkPeriodAsLoadedAction {
	return {
		type: 'MARK_PERIOD_AS_LOADED',
		period: {
			type: 'period',
			id: `${ firstDay }::${ lastDay }`,
			firstDay,
			lastDay,
		},
	};
} //end markPeriodAsLoaded()

export function markAsUpdating(
	item: UpdatingItemSummary
): MarkAsUpdatingAction {
	return {
		type: 'MARK_AS_UPDATING',
		item,
	};
} //end markAsUpdating()

export function markAsUpdated(
	item: UpdatingItemSummary
): MarkAsUpdatedAction {
	return {
		type: 'MARK_AS_UPDATED',
		item,
	};
} //end markAsUpdated()

export function setLoaderTimeout( timeout: Timeout ): SetLoaderTimeoutAction {
	return {
		type: 'SET_LOADER_TIMEOUT',
		timeout,
	};
} //end setLoaderTimeout()

// ============
// HELPER TYPES
// ============

type MarkPeriodAsLoadingAction = {
	readonly type: 'MARK_PERIOD_AS_LOADING';
	readonly period: Period;
};

type MarkPeriodAsLoadedAction = {
	readonly type: 'MARK_PERIOD_AS_LOADED';
	readonly period: Period;
};

type MarkAsUpdatingAction = {
	readonly type: 'MARK_AS_UPDATING';
	readonly item: UpdatingItemSummary;
};

type MarkAsUpdatedAction = {
	readonly type: 'MARK_AS_UPDATED';
	readonly item: UpdatingItemSummary;
};

type SetLoaderTimeoutAction = {
	readonly type: 'SET_LOADER_TIMEOUT';
	readonly timeout: Timeout;
};
