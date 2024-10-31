/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { AutomationGroupId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { UniversalSettings } from './universal';
import { RegularSettings } from './regular';

export type AutomationGroupSettingsProps = {
	readonly groupId: AutomationGroupId;
};

export const AutomationGroupSettings = ( {
	groupId,
}: AutomationGroupSettingsProps ): JSX.Element =>
	'universal' === groupId ? (
		<UniversalSettings />
	) : (
		<RegularSettings groupId={ groupId } />
	);
