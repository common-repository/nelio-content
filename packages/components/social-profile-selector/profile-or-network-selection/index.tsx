/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { SingleValueProps } from 'react-select';

/**
 * Internal dependencies
 */
import './style.scss';
import { SocialNetworkIcon } from '../../social-network-icon';

import type { OptionData } from '../profile-or-network-option';

export const ProfileOrNetworkSelection = ( {
	data: { label, network },
	selectProps: { isDisabled },
	innerProps,
}: SingleValueProps< OptionData > ): JSX.Element => (
	<div
		className={ classnames( {
			'nelio-content-network-selection-in-profile-selector': true,
			'nelio-content-network-selection-in-profile-selector--is-disabled':
				isDisabled,
		} ) }
		{ ...innerProps }
	>
		<div className="nelio-content-network-selection-in-profile-selector__icon">
			<SocialNetworkIcon network={ network } />
		</div>

		<div className="nelio-content-network-selection-in-profile-selector__label">
			{ label }
		</div>
	</div>
);
