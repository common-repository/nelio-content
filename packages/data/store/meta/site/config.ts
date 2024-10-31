/**
 * External dependencies
 */
import { make } from 'ts-brand';
import type {
	PostType,
	PostTypeContext,
	PostTypeName,
	Url,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly activePlugins: ReadonlyArray< string >;
	readonly adminUrl: Url;
	readonly firstDayOfWeek: number;
	readonly homeUrl: Url;
	readonly id: Uuid;
	readonly isMultiAuthor: boolean;
	readonly language: string;
	readonly now: string;
	readonly postTypes: Record< PostTypeName, PostType >;
	readonly postTypesByContext: Record<
		PostTypeContext,
		ReadonlyArray< PostTypeName >
	>;
	readonly restUrl: Url;
	readonly timezone: string;
};

export const INIT: State = {
	activePlugins: [],
	adminUrl: make< Url >()( '' ),
	firstDayOfWeek: 0,
	homeUrl: make< Url >()( '' ),
	id: make< Uuid >()( '' ),
	isMultiAuthor: false,
	language: '',
	now: '',
	postTypes: {},
	postTypesByContext: {
		analytics: [],
		calendar: [],
		comments: [],
		'content-board': [],
		efi: [],
		notifications: [],
		'future-actions': [],
		'quality-checks': [],
		references: [],
		social: [],
		tasks: [],
	},
	restUrl: make< Url >()( '' ),
	timezone: '+00:00',
};
