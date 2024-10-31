/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as NC_TASK_EDITOR } from '../../store';

export type BackButtonProps = {
	readonly disabled?: boolean;
};

export const BackButton = ( { disabled }: BackButtonProps ): JSX.Element => {
	const { setDateType, setDateValue } = useDispatch( NC_TASK_EDITOR );
	const onClick = () => {
		void setDateType( 'predefined-offset' );
		void setDateValue( '0' );
	};

	return (
		<div className="nelio-content-task-editor-date-due__back-button">
			<Button variant="link" disabled={ disabled } onClick={ onClick }>
				{ _x( 'Back', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};
