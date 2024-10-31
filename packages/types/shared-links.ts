/**
 * Internal dependencies
 */
import type { Email, Url } from './utils';

export type SharedLink = {
	readonly responseCode: number;
	readonly author: string;
	readonly date: string;
	readonly domain: string;
	readonly email: Email | '';
	readonly excerpt: string;
	readonly image: Url | '';
	readonly permalink: Url;
	readonly title: string;
	readonly twitter: string;
};

export type SharedLinkStatus = 'loading' | 'ready' | 'error';
