/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { AutomationGroupId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	useAutomationGroup,
	useIsSaving,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

/**
 * Internal dependencies
 */
import './style.scss';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { useValidationEffect } from './use-validation-effect';

import { AutomationGroupSettings } from '../automation-group-settings';
import { ProfileSettings } from '../profile-settings';
import type { Tab } from './sidebar';

export type AutomationGroupProps = {
	readonly groupId: AutomationGroupId;
};

export const AutomationGroup = ( {
	groupId,
}: AutomationGroupProps ): JSX.Element => {
	const [ isActive, setActive ] = useIsGroupActive( groupId );
	const [ isExpanded, expand ] = useState( isActive );
	const [ tab, setTab ] = useState< Tab >( { type: 'settings' } );
	const isSaving = useIsSaving();

	const toggle = () => expand( ! isExpanded );
	const toggleActivation = () => setActive( ! isActive );

	useValidationEffect( groupId );

	return (
		<div
			className={ classnames( {
				'nelio-content-automation-group': true,
				'nelio-content-automation-group--inactive':
					! isActive && ! isExpanded,
				'nelio-content-automation-group--disabled': isSaving,
			} ) }
		>
			<Header
				groupId={ groupId }
				isActive={ isActive }
				isExpanded={ isExpanded }
				onToggleActivation={ toggleActivation }
				onToggle={ toggle }
			/>
			{ isExpanded && (
				<div className="nelio-content-automation-group__body">
					<Sidebar
						groupId={ groupId }
						activeTab={ tab }
						setActiveTab={ setTab }
					/>
					<div className="nelio-content-automation-group__body-content">
						{ 'settings' === tab.type ? (
							<AutomationGroupSettings groupId={ groupId } />
						) : (
							<ProfileSettings
								groupId={ groupId }
								profileId={ tab.id }
							/>
						) }
					</div>
				</div>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsGroupActive = ( groupId: AutomationGroupId ) => {
	const group = useAutomationGroup( groupId );
	const isActive = !! group?.priority;
	const { updateAutomationGroup } = useDispatch( NC_AUTOMATION_SETTINGS );

	const setActive = ( value: boolean ) =>
		updateAutomationGroup( groupId, { priority: value ? 100 : 0 } );

	return [ isActive, setActive ] as const;
};
