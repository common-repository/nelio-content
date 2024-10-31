/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { useAdminUrl, usePostTypes } from '@nelio-content/data';
import { isUniversalGroup, listify } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { PublicationControl } from './publication-control';
import { ProfileSelector } from './profile-selector';

import './style.scss';
import { useAutomationGroup } from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export const UniversalSettings = (): JSX.Element => {
	const strongify = ( s: string ) => `<strong>${ s }</strong>`;
	const postTypeNames = map(
		usePostTypes( 'social' ),
		( pt ) => pt.labels.plural
	);
	const postTypes = listify( 'and', map( postTypeNames, strongify ) );
	const advancedSettingsLink = useAdminUrl( 'admin.php', {
		page: 'nelio-content-settings',
		subpage: 'social--advanced',
	} );

	return (
		<div className="nelio-content-automation-group-settings">
			<div className="nelio-content-automation-group-settings__section">
				<p className="nelio-content-automation-group-settings__section-title">
					{ _x(
						'Which content should be shared?',
						'user',
						'nelio-content'
					) }
				</p>
				<div className="nelio-content-automation-group-settings__section-content">
					<BaseControl
						id="nelio-content-universal-post-types"
						label={ _x( 'Post Types', 'text', 'nelio-content' ) }
					>
						<p className="nelio-content-automation-group-settings__universal-post-types">
							{ createInterpolateElement(
								sprintf(
									/* translators: list of post type names */
									_x(
										'When enabled, the universal group applies to all your <a>shareable content</a>: %s.',
										'text',
										'nelio-content'
									),
									postTypes
								),
								{
									strong: <strong></strong>,
									a: <a href={ advancedSettingsLink }>.</a>,
								}
							) }
						</p>
					</BaseControl>
					<Details />
				</div>
			</div>

			<ProfileSelector groupId="universal" />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Details = (): JSX.Element | null => {
	const group = useAutomationGroup( 'universal' );
	const { updateAutomationGroup } = useDispatch( NC_AUTOMATION_SETTINGS );

	if ( ! isUniversalGroup( group ) ) {
		return null;
	} //end if

	const { publication } = group;
	const setPublication = ( p: typeof group.publication ) =>
		updateAutomationGroup( 'universal', {
			publication: p,
		} );

	return (
		<div className="nelio-content-automation-group-settings__extra">
			<PublicationControl
				value={ publication }
				onChange={ setPublication }
			/>
		</div>
	);
};
