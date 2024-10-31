/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDateType, useDateValue } from './hooks';

export type BackButtonProps = {
	readonly disabled?: boolean;
};

export const BackButton = ( { disabled }: BackButtonProps ): JSX.Element => {
	const [ _, setDateType ] = useDateType();
	const [ __, setDateValue ] = useDateValue();

	const onClick = () => {
		setDateType( 'predefined-offset' );
		setDateValue( '0' );
	};

	return (
		<div className="nelio-content-task-editor-date-due__back-button">
			<Button variant="link" disabled={ disabled } onClick={ onClick }>
				{ _x( 'Back', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};
