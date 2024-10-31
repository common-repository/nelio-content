/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * External dependencies
 */
export type { Uuid } from 'uuid';

// =======
// GENERIC
// =======

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type NonEmptyArray< T > = readonly [ T, ...T[] ];

export type Email = Brand< string, 'Email' >;

export type Url = Brand< string, 'Url' >;

export type Dict< T = unknown > = Record< string, T >;

export type Percentage = number;

export type Maybe< T > = T | undefined;

export type Optional<
	// eslint-disable-next-line
	T extends Record< string, any >,
	K extends keyof T,
> = Omit< T, K > & Partial< Pick< T, K > >;

export type ArrayToUnion<
	T extends Array< unknown > | ReadonlyArray< unknown >,
> = T[ number ];

export type MutableAndReadonlyArray<
	T extends Array< unknown > | ReadonlyArray< unknown >,
> =
	| { readonly [ I in keyof T ]: T[ I ] }
	| { -readonly [ I in keyof T ]: T[ I ] };

export type AnyAction = Dict & {
	readonly type: string;
};

export type RegularQueryArg = Readonly< [ QueryArgName, QueryArgValue ] >;
export type OverwriteableQueryArg = Readonly<
	[ QueryArgName, QueryArgValue, true ]
>;

export type QueryArgName = string;
export type QueryArgValue = string;

// ====
// HELP
// ====

export type Question = {
	readonly link: string;
	readonly label: string;
};

export type Walkthrough< T extends TutorialStep = TutorialStep > = T extends T
	? ReadonlyArray< T >
	: never;

export type TutorialStep = {
	readonly intro: string;
	readonly title: string;
	readonly elementToClick?: () => HTMLElement | null;
	readonly active?: () => boolean;
	readonly element?: () => HTMLElement | null;
};

// =========
// API FETCH
// =========

export type PaginatedResults< T > = {
	readonly results: T;
	readonly pagination: {
		readonly more: boolean;
		readonly pages: number;
	};
};

// ======
// STORES
// ======

/* eslint-disable @typescript-eslint/no-explicit-any */
export type WithResolverSelect<
	S extends Record< string, ( ...args: any[] ) => any >,
	RS extends Record< string, ( ...args: any[] ) => any >,
> = S & {
	readonly isResolving: ResolverSelect< RS >;
	readonly hasFinishedResolution: ResolverSelect< RS >;
	readonly hasResolutionFailed: ResolverSelect< RS >;
};

export type WithResolverDispatch<
	S extends Record< string, ( ...args: any[] ) => any >,
	RS extends Record< string, ( ...args: any[] ) => any >,
> = S & {
	readonly invalidateResolution: ResolverDispatch< RS >;
};

type ResolverSelect< RS extends Record< string, ( ...args: any[] ) => any > > =
	< K extends keyof RS >(
		state: unknown,
		fn: K,
		args?: Parameters< RS[ NoInfer< K > ] >
	) => boolean;

type ResolverDispatch<
	RS extends Record< string, ( ...args: any[] ) => any >,
> = < K extends keyof RS >(
	fn: K,
	args?: Parameters< RS[ NoInfer< K > ] >
) => boolean;
