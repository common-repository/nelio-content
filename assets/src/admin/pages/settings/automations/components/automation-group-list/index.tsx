/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PremiumFeatureButton } from '@nelio-content/components';
import { store as NC_DATA, usePostTypes } from '@nelio-content/data';
import { createAutomationGroupId, isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { useAreGroupsDirty } from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';
import { AutomationGroup } from '../automation-group';

export const AutomationGroupList = (): JSX.Element | null => {
	const groups = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getAutomationGroups()
	);
	const maxAutomationGroups = useSelect(
		( select ) => select( NC_DATA ).getPluginLimits().maxAutomationGroups
	);
	const canManagePlugin = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserManagePlugin()
	);
	const canAddGroup = groups.length < maxAutomationGroups;
	const postTypes = usePostTypes( 'social' );
	const { addAutomationGroup, saveAutomationGroups } = useDispatch(
		NC_AUTOMATION_SETTINGS
	);

	const isSavingGroups = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isSaving()
	);
	const areGroupsDirty = useAreGroupsDirty();

	const createAutomationGroup = () =>
		void (
			postTypes[ 0 ] &&
			addAutomationGroup( {
				id: createAutomationGroupId(),
				name: '',
				priority: 100,
				postType: postTypes[ 0 ].name,
				taxonomies: {},
				publication: { type: 'always' },
				authors: [],
				profileSettings: {},
				networkSettings: {},
			} )
		);

	if ( isEmpty( groups ) ) {
		return null;
	} //end if

	return (
		<>
			<div className="nelio-content-automation-group-list">
				{ groups.map( ( id ) => (
					<AutomationGroup key={ id } groupId={ id } />
				) ) }
			</div>

			<LimitWarning
				limit={ maxAutomationGroups }
				active={ ! canAddGroup }
			/>

			<div className="nelio-content-automation-group-list__actions">
				{ ! isEmpty( groups ) && (
					<Button
						className="nelio-content-save-automation-groups"
						variant="primary"
						onClick={ saveAutomationGroups }
						disabled={ ! areGroupsDirty || isSavingGroups }
					>
						{ isSavingGroups
							? _x( 'Saving…', 'text', 'nelio-content' )
							: _x( 'Save Changes', 'command', 'nelio-content' ) }
					</Button>
				) }

				{ 1 === maxAutomationGroups && canManagePlugin && (
					<PremiumFeatureButton
						feature="raw/automation-groups"
						label={ _x( 'Add Group', 'command', 'nelio-content' ) }
						variant="secondary"
					/>
				) }

				{ 1 < maxAutomationGroups && (
					<Button
						className="nelio-content-add-automation-group"
						variant={ isEmpty( groups ) ? 'primary' : 'secondary' }
						onClick={ createAutomationGroup }
						disabled={ isSavingGroups || ! canAddGroup }
					>
						{ _x( 'Add Group', 'command', 'nelio-content' ) }
					</Button>
				) }
			</div>
		</>
	);
};

// ============
// HELPER VIEWS
// ============

const LimitWarning = ( {
	active,
	limit,
}: {
	readonly active: boolean;
	readonly limit: number;
} ): JSX.Element | null => {
	const accountPageUrl = useSelect( ( select ) =>
		select( NC_DATA ).getAdminUrl( '/admin.php', {
			page: 'nelio-content-account',
		} )
	);
	const canManagePlugin = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserManagePlugin()
	);
	const isBestPlan = useSelect( ( select ) =>
		select( NC_DATA ).isSubscribed( 'plus' )
	);

	if ( ! active || limit === 1 ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-automation-group-list__error">
			{ sprintf(
				/* translators: number of groups allowed */
				_x(
					'You’ve reached the maximum number of automation groups allowed (i.e. %d).',
					'user',
					'nelio-content'
				),
				limit
			) + ' ' }
			{ ! isBestPlan && canManagePlugin && (
				<ExternalLink href={ accountPageUrl }>
					{ _x(
						'Please consider upgrading your subscription.',
						'user',
						'nelio-content'
					) }
				</ExternalLink>
			) }
		</div>
	);
};
