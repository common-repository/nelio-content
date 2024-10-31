/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import type { SocialNetworkName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { SocialNetworkIcon } from '../../social-network-icon';
import { SocialProfileIcon } from '../../social-profile-icon';

export type OptionData = {
	readonly type: 'social-profile' | 'network';
	readonly id: Uuid | `network:${ SocialNetworkName }`;
	readonly label: string;
	readonly network: SocialNetworkName;
	readonly value: string;
};

export const ProfileOrNetworkOption = ( {
	data,
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< OptionData > ): JSX.Element => (
	<div
		ref={ innerRef }
		className={ classnames( {
			'nelio-content-profile-or-network-option-in-profile-selector': true,
			'nelio-content-profile-or-network-option-in-profile-selector--is-focused':
				isFocused,
			'nelio-content-profile-or-network-option-in-profile-selector--is-selected':
				isSelected,
		} ) }
		{ ...innerProps }
	>
		{ 'network' === data.type ? (
			<div className="nelio-content-profile-or-network-option-in-profile-selector__icon">
				<SocialNetworkIcon network={ data.network } />
			</div>
		) : (
			<div className="nelio-content-profile-or-network-option-in-profile-selector__icon">
				<SocialProfileIcon profileId={ data.id as Uuid } />
			</div>
		) }

		<div className="nelio-content-profile-or-network-option-in-profile-selector__label">
			{ data.label }
		</div>
	</div>
);
