/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Url } from './utils';

export type FSProductId = Brand< string, 'FSProductId' >;

export type FSProduct = {
	readonly id: FSProductId;
	readonly description: TranslatableString;
	readonly displayName: TranslatableString;
	readonly price: Record< Currency, number >;
	readonly upgradeableFrom: ReadonlyArray< FSProductId >;
};

export type InvoiceId = Brand< string, 'InvoiceId' >;

export type Invoice = {
	readonly id: InvoiceId;
	readonly chargeDate: string;
	readonly invoiceUrl: Url;
	readonly isRefunded: boolean;
	readonly reference: string;
	readonly subtotalDisplay: string;
};

// ============
// HELPER TYPES
// ============

type Currency = string;

type TranslatableString = Record< Language, string >;

type Language = string;
