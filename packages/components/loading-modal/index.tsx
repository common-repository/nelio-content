/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, Spinner } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

export type LoadingModalProps = {
	readonly children?: JSX.Element | ReadonlyArray< JSX.Element >;
	readonly className?: string;
	readonly isLoading?: boolean;
	readonly loadingErrorMessage?: string;
	readonly onClose: () => void;
	readonly title: string;
};

export const LoadingModal = ( {
	children,
	className,
	isLoading,
	loadingErrorMessage,
	onClose,
	title,
}: LoadingModalProps ): JSX.Element => (
	<Modal
		className={
			isLoading || loadingErrorMessage
				? 'nelio-content-loading-modal'
				: className
		}
		title={ getTitle( title, isLoading, loadingErrorMessage ) }
		isDismissible={ false }
		shouldCloseOnClickOutside={ false }
		shouldCloseOnEsc={ false }
		onRequestClose={ () => void null }
	>
		{ isLoading && (
			<div className="nelio-content-loading-modal__content">
				<Spinner />
			</div>
		) }

		{ !! loadingErrorMessage && (
			<div className="nelio-content-loading-modal__content">
				<div className="nelio-content-loading-modal__error">
					{ loadingErrorMessage }
				</div>
				<div className="nelio-content-loading-modal__actions">
					<Button variant="secondary" onClick={ onClose }>
						{ _x( 'Close', 'command', 'nelio-content' ) }
					</Button>
				</div>
			</div>
		) }

		{ ! isLoading && ! loadingErrorMessage && children }
	</Modal>
);

// =======
// HELPERS
// =======

function getTitle(
	title: string,
	isLoading?: boolean,
	loadingErrorMessage?: string
) {
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-content' );
	} //end if

	if ( !! loadingErrorMessage ) {
		return _x( 'Error', 'text', 'nelio-content' );
	} //end if

	return title;
} //end getTitle()
