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
import { CharCounter } from '../char-counter';
import { useDoesActiveNetworkSupport } from '../../hooks';

export type CharCounterWrapperProps = {
	readonly disabled?: boolean;
};

export const CharCounterWrapper = ( {
	disabled,
}: CharCounterWrapperProps ): JSX.Element | null =>
	useDoesActiveNetworkSupport( 'text' ) ? (
		<div
			className={ classnames( {
				'nelio-content-social-message-editor__char-counter-wrapper':
					true,
				'nelio-content-social-message-editor__char-counter-wrapper--is-disabled':
					disabled,
			} ) }
		>
			<CharCounter />
		</div>
	) : null;
