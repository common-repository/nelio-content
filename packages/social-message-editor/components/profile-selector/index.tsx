/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { useIsMultiProfileSelector } from '../../hooks';

import { SingleProfileSelector } from './single';
import { MultipleProfileSelector } from './multiple';

export type ProfileSelectorProps = {
	readonly disabled?: boolean;
};

export const ProfileSelector = ( {
	disabled,
}: ProfileSelectorProps ): JSX.Element => {
	const Component = useIsMultiProfileSelector()
		? MultipleProfileSelector
		: SingleProfileSelector;
	return <Component disabled={ disabled } />;
};
