/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import type { SocialTargetName, Url } from '@nelio-content/types';

export type TargetProps = {
	readonly displayName: string;
	readonly image?: Url;
	readonly isSelected: boolean;
	readonly name: SocialTargetName;
	readonly onClick: ( checked: boolean ) => void;
};

export const Target = ( {
	displayName,
	name,
	image,
	onClick,
	isSelected,
}: TargetProps ): JSX.Element => (
	<li className="nelio-content-target-selector__target" data-name={ name }>
		<CheckboxControl
			className="nelio-content-target-selector__checkbox"
			label={
				isSelected ? <strong>{ displayName }</strong> : displayName
			}
			checked={ isSelected }
			onChange={ onClick }
		/>

		<div
			className="nelio-content-target-selector__target-image"
			style={ { backgroundImage: `url(${ image || '' })` } }
		></div>
	</li>
);
