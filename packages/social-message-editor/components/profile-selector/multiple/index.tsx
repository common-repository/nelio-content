/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

import { Networks } from './networks';
import { Profiles } from './profiles';
import { TargetSelector } from './target-selector';
import { useDoesActiveNetworkSupport } from '../../../hooks';

export type MultipleProfileSelectorProps = {
	readonly disabled?: boolean;
};

export const MultipleProfileSelector = ( {
	disabled,
}: MultipleProfileSelectorProps ): JSX.Element => {
	const className = 'nelio-content-multiple-profile-selector';
	const supportsText = useDoesActiveNetworkSupport( 'text' );

	return (
		<div
			className={ classnames( {
				[ className ]: true,
				[ `${ className }--has-text-support` ]: supportsText,
			} ) }
		>
			<Networks disabled={ disabled } />
			<Profiles disabled={ disabled } />
			<TargetSelector />
		</div>
	);
};
