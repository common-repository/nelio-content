/**
 * External dependencies
 */
import type { SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type {
	OpenConnectionDialogAction,
	CloseConnectionDialogAction,
} from '../side-effects';

export type ConnectionAction =
	| OpenKindSelectorDialogAction
	| CloseKindSelectorDialogAction
	| OpenConnectionDialogAction
	| CloseConnectionDialogAction;

export function openKindSelectorDialog(
	network: SocialNetworkName
): OpenKindSelectorDialogAction {
	return {
		type: 'OPEN_KIND_DIALOG_FOR_NETWORK',
		network,
	};
} //end openKindSelectorDialog()

export function closeKindSelectorDialog(): CloseKindSelectorDialogAction {
	return {
		type: 'CLOSE_KIND_DIALOG',
	};
} //end closeKindSelectorDialog()

// ============
// HELPER TYPES
// ============

type OpenKindSelectorDialogAction = {
	readonly type: 'OPEN_KIND_DIALOG_FOR_NETWORK';
	readonly network: SocialNetworkName;
};

type CloseKindSelectorDialogAction = {
	readonly type: 'CLOSE_KIND_DIALOG';
};
