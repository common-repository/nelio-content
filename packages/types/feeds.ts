/**
 * Internal dependencies
 */
import type { Url } from './utils';

export type FeedId = Url;

export type Feed = {
	readonly id: FeedId;
	readonly url: Url;
	readonly name: string;
	readonly twitter: string;
	readonly icon: string;
};

export type FeedItemId = Url;

export type FeedItem = {
	readonly id: FeedItemId;
	readonly authors: ReadonlyArray< string >;
	readonly date: string;
	readonly excerpt: string;
	readonly feedId: FeedId;
	readonly permalink: Url;
	readonly title: string;
	readonly twitter: string;
};
