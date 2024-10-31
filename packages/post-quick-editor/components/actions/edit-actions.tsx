/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SaveButton } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { ExtraAction } from './extra-action';
import { store as NC_POST_EDITOR } from '../../store';
import { useIsSaving, useIsNew, useIsDisabled } from '../../hooks';

export const EditActions = (): JSX.Element => {
	const { close, saveAndClose } = useDispatch( NC_POST_EDITOR );
	const disabled = useIsDisabled();
	const error = useError();
	const isNew = useIsNew();
	const isSaving = useIsSaving();

	return (
		<div className="nelio-content-post-quick-editor__actions">
			<ExtraAction />

			<Button variant="secondary" disabled={ disabled } onClick={ close }>
				{ _x( 'Cancel', 'command', 'nelio-content' ) }
			</Button>

			<SaveButton
				variant="primary"
				error={ error }
				isSaving={ isSaving }
				isUpdate={ ! isNew }
				onClick={ saveAndClose }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useError = () =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).getValidationError() );
