/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Tooltip } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export type SaveButtonProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly error?: string;
	readonly variant?: 'primary' | 'secondary';
	readonly isSaving?: boolean;
	readonly isUpdate?: boolean;
	readonly onClick?: () => void;
	readonly baseLabel?: string;
	readonly loadingLabel?: string;
};

const InternalSaveButton = ( {
	baseLabel,
	loadingLabel,
	className = '',
	disabled = false,
	error = '',
	variant = 'secondary',
	isSaving = false,
	isUpdate = false,
	onClick = () => void null,
}: SaveButtonProps ): JSX.Element => (
	<Button
		className={ classnames( {
			[ className ]: !! className,
			'nelio-content-save-button': true,
			'nelio-content-save-button--is-saving': isSaving,
		} ) }
		variant={ variant }
		isBusy={ isSaving }
		disabled={ isSaving || disabled || !! error }
		onClick={ () => ! disabled && ! error && onClick() }
	>
		{ ! isUpdate &&
			! isSaving &&
			( baseLabel ?? _x( 'Save', 'command', 'nelio-content' ) ) }
		{ ! isUpdate &&
			isSaving &&
			( loadingLabel ?? _x( 'Saving…', 'text', 'nelio-content' ) ) }
		{ isUpdate &&
			! isSaving &&
			( baseLabel ?? _x( 'Update', 'command', 'nelio-content' ) ) }
		{ isUpdate &&
			isSaving &&
			( loadingLabel ?? _x( 'Updating…', 'text', 'nelio-content' ) ) }
	</Button>
);

const InternalSaveButtonWithRationale = ( {
	className,
	error,
	...props
}: SaveButtonProps ): JSX.Element =>
	!! error ? (
		<Tooltip text={ error } { ...{ delay: 0 } }>
			<span className={ className }>
				<InternalSaveButton error={ error } { ...props } />
			</span>
		</Tooltip>
	) : (
		<InternalSaveButton
			className={ className }
			error={ error }
			{ ...props }
		/>
	);

export const SaveButton = InternalSaveButtonWithRationale;
