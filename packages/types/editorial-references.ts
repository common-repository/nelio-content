/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Url } from './utils';
import type { AuthorId } from './wordpress-entities';

export type EditorialReferenceId = Brand< number, 'EditorialReferenceId' >;

export type EditorialReference = {
	readonly id: EditorialReferenceId;
	readonly author: string;
	readonly date: string;
	readonly email: string;
	readonly isExternal: boolean;
	readonly isSuggestion: boolean;
	readonly status: 'pending' | 'improvable' | 'complete' | 'broken' | 'check';
	readonly title: string;
	readonly twitter: string;
	readonly url: Url;
	readonly suggestionAdvisorId?: AuthorId;
	readonly suggestionDate?: string;
};

export type AwsEditorialReference = Pick<
	EditorialReference,
	'url' | 'author' | 'title' | 'twitter'
>;
