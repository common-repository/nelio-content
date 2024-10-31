/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextareaControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useDoesActiveNetworkSupport,
	useText,
	useIsMultiProfileSelector,
} from '../../hooks';

export type MessageEditorProps = {
	readonly disabled: boolean;
};

export const MessageEditor = ( {
	disabled,
}: MessageEditorProps ): JSX.Element | null => {
	const supportsText = useDoesActiveNetworkSupport( 'text' );
	const [ text, setText ] = useText();
	const isMultiProfileSelector = useIsMultiProfileSelector();

	if ( ! supportsText ) {
		return null;
	} //end if

	return (
		<div
			className={ classnames( {
				'nelio-content-social-message-editor__message-editor': true,
				'nelio-content-social-message-editor__message-editor--is-merged-with-social-profile-selector':
					isMultiProfileSelector,
			} ) }
		>
			<TextareaControl
				disabled={ disabled }
				value={ text }
				onChange={ ( value ) => setText( value ) }
				placeholder={ _x(
					'Your status update…',
					'text',
					'nelio-content'
				) }
			/>
		</div>
	);
};
