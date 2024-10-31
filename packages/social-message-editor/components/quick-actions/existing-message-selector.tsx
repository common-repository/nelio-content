/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Spinner,
} from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import {
	useDoesActiveNetworkSupport,
	useIsLoadingPreviousMessages,
	useExistingMessages,
	useRelatedPost,
	useText,
} from '../../hooks';

// NOTE. This is a workaround because, for some reason, clicking outside the dropdown doesn’t work if the click is still inside the modal window.
let doCloseMenu: () => void;
const closeMenuOnBlur = () => {
	if ( 'function' === typeof doCloseMenu ) {
		doCloseMenu();
	} //end if
};

export type ExistingMessageSelectorProps = {
	readonly disabled?: boolean;
};

export const ExistingMessageSelector = ( {
	disabled,
}: ExistingMessageSelectorProps ): JSX.Element | null => {
	const supportsText = useDoesActiveNetworkSupport( 'text' );
	const [ post ] = useRelatedPost();
	const { published, pending } = useExistingMessages();
	const isLoadingPreviousMessages = useIsLoadingPreviousMessages();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [ _, setText ] = useText();
	const hasMessages = !! published.length || !! pending.length;

	if ( ! supportsText ) {
		return null;
	} //end if

	if ( ! post ) {
		return null;
	} //end if

	return (
		<DropdownMenu
			className="nelio-content-social-message-editor__quick-action nelio-content-social-message-editor__existing-message-selector"
			icon="backup"
			label={ _x( 'Previous Social Messages', 'text', 'nelio-content' ) }
			toggleProps={ {
				disabled: disabled || ! hasMessages,
				tooltipPosition: 'bottom center',
			} }
			popoverProps={ { onFocusOutside: closeMenuOnBlur } }
		>
			{ ( { onClose }: { onClose: () => void } ) => {
				// NOTE. This is part of the workaround mentioned before.
				doCloseMenu = onClose;

				if ( isLoadingPreviousMessages ) {
					/* eslint-disable @typescript-eslint/no-explicit-any */
					return (
						<div className="nelio-content-social-message-editor__previous-messages-loader">
							<Spinner { ...( { isActive: true } as any ) } />
							{ _x( 'Loading…', 'text', 'nelio-conent' ) }
						</div>
					);
					/* eslint-enable @typescript-eslint/no-explicit-any */
				} //end if

				const shorten = ( message: string ) =>
					80 < message.length
						? trim( message.substring( 0, 75 ) ) + '…'
						: message;

				return (
					<>
						{ !! published.length && (
							<MenuGroup
								label={ _x(
									'Previous Social Messages',
									'text',
									'nelio-content'
								) }
							>
								{ published.map( ( message ) => (
									<MenuItem
										key={ message }
										role="menuitem"
										onClick={ () => {
											onClose();
											setText( message );
										} }
									>
										{ shorten( message ) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }
						{ !! pending.length && (
							<MenuGroup
								label={ _x(
									'Other Social Messages',
									'text',
									'nelio-content'
								) }
							>
								{ pending.map( ( message ) => (
									<MenuItem
										key={ message }
										role="menuitem"
										onClick={ () => {
											onClose();
											setText( message );
										} }
									>
										{ shorten( message ) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }
					</>
				);
			} }
		</DropdownMenu>
	);
};
