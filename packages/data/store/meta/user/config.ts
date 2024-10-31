/**
 * External dependencies
 */
import { make } from 'ts-brand';
import type {
	AuthorId,
	PostCapability,
	PostTypeName,
	PremiumItemType,
} from '@nelio-content/types';

export type State = {
	readonly id: AuthorId;
	readonly pluginPermission: 'manage' | 'use';
	readonly postTypeCapabilities: Record< PostTypeName, PostCapability >;
	readonly socialEditorPermission: 'none' | 'post-type' | 'all';
	readonly taskEditorPermission: 'none' | 'post-type' | 'all';
	readonly premiumEditorPermissionsByType: Partial<
		Record< PremiumItemType, 'none' | 'post-type' | 'all' >
	>;
};

export const INIT: State = {
	id: make< AuthorId >()( 0 ),
	pluginPermission: 'use',
	postTypeCapabilities: {},
	socialEditorPermission: 'none',
	taskEditorPermission: 'none',
	premiumEditorPermissionsByType: {},
};
