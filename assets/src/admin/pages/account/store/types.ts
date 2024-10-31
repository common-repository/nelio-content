/**
 * External dependencies
 */
import type {
	Account,
	FSProduct,
	Invoice,
	Maybe,
	Site,
} from '@nelio-content/types';

export type State = {
	readonly info: Account;
	readonly invoices: ReadonlyArray< Invoice >;
	readonly products: ReadonlyArray< FSProduct >;
	readonly sites: ReadonlyArray< Site >;
	readonly meta: {
		readonly dialog: Maybe< DialogName >;
		readonly editingLicense: string;
		readonly lockReason: Maybe< LockReason >;
		readonly isAgencySummary: boolean;
	};
};

export type DialogName =
	| 'cancel-subscription'
	| 'license-popover'
	| 'remove-license'
	| 'reactivate-subscription';

export type LockReason =
	| 'no-reason'
	| 'apply-license'
	| 'cancel-subscription'
	| 'reactivate-subscription'
	| 'remove-license'
	| 'upgrade-subscription';
