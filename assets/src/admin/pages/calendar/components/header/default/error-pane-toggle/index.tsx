/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export type ToggleErrorPaneButtonProps = {
	readonly className?: string;
};

export const ErrorPaneToggle = ( {
	className = '',
}: ToggleErrorPaneButtonProps ): JSX.Element | null => {
	const { toggleSidePane } = useDispatch( NC_CALENDAR );
	const isErrorPaneOpen = useSelect( ( select ) =>
		select( NC_CALENDAR ).isErrorPaneOpen()
	);
	const hasErrors = useSelect(
		( select ) => !! select( NOTICES ).getNotices().length
	);

	useEffect( () => {
		if ( isErrorPaneOpen && ! hasErrors ) {
			void toggleSidePane( 'errors' );
		} //end if
	}, [ isErrorPaneOpen, hasErrors ] );

	if ( ! isErrorPaneOpen && ! hasErrors ) {
		return null;
	} //end if

	return (
		<div className={ className }>
			<Button
				className={ classnames( {
					[ className ]: true,
					'nelio-content-error-pane-toggle': true,
					'nelio-content-error-pane-toggle--has-errors': hasErrors,
					'nelio-content-error-pane-toggle--is-toggled':
						isErrorPaneOpen,
				} ) }
				icon="warning"
				label={
					isErrorPaneOpen
						? _x( 'Hide Errors', 'command', 'nelio-content' )
						: _x( 'Show Errors', 'command', 'nelio-content' )
				}
				tooltipPosition="bottom center"
				isPressed={ isErrorPaneOpen }
				onClick={ () => toggleSidePane( 'errors' ) }
			/>
		</div>
	);
};
