/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import type { SocialTargetName, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type TargetData = {
	readonly value: SocialTargetName;
	readonly label: string;
	readonly image?: Url;
};

export const TargetOption = ( {
	data: { label, image },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< TargetData > ): JSX.Element => (
	<div
		ref={ innerRef }
		className={ classnames( {
			'nelio-content-target-option-in-profile-selector': true,
			'nelio-content-target-option-in-profile-selector--is-focused':
				isFocused,
			'nelio-content-target-option-in-profile-selector--is-selected':
				isSelected,
		} ) }
		{ ...innerProps }
	>
		<div className="nelio-content-target-option-in-profile-selector__icon-wrapper">
			<div
				className="nelio-content-target-option-in-profile-selector__icon"
				style={ { backgroundImage: `url(${ image || '' })` } }
			></div>
		</div>

		<div className="nelio-content-target-option-in-profile-selector__label">
			{ label }
		</div>
	</div>
);
