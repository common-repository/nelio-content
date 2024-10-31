/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SaveButton } from '@nelio-content/components';
import { getTargetLabel } from '@nelio-content/networks';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { Target } from './target';
import { store as NC_SOCIAL_EDITOR } from '../../../../store';
import { useTargetSelectorProps } from '../../../../hooks';

export const TargetSelector = (): JSX.Element | null => {
	const props = useTargetSelectorProps();
	const {
		closeTargetSelector,
		selectTargetInTargetSelector,
		setSelectedTargetsInProfile,
	} = useDispatch( NC_SOCIAL_EDITOR );

	const { isVisible } = props;
	if ( ! isVisible ) {
		return null;
	} //end if

	const { profileId, network, isLoading, selectedTargetNames, targets } =
		props;

	const close = closeTargetSelector;
	const selectTarget = selectTargetInTargetSelector;
	const saveSelection = () => {
		void setSelectedTargetsInProfile( profileId, selectedTargetNames );
		void closeTargetSelector();
	};

	return (
		<Modal
			className="nelio-content-target-selector"
			title={ getTargetLabel( 'title', network ) }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			{ !! isLoading && (
				<p className="nelio-content-target-selector__info">
					{ getTargetLabel( 'loading', network ) }
				</p>
			) }

			{ ! isLoading && isEmpty( targets ) && (
				<p className="nelio-content-target-selector__info">
					{ getTargetLabel( 'noTargetsExplanation', network ) }
				</p>
			) }

			{ ! isLoading && ! isEmpty( targets ) && (
				<p className="nelio-content-target-selector__info">
					{ getTargetLabel( 'explanation', network ) }
				</p>
			) }

			{ ! isLoading && ! isEmpty( targets ) && (
				<ul className="nelio-content-target-selector__targets">
					{ targets.map( ( target ) => (
						<Target
							key={ target.name }
							isSelected={ selectedTargetNames.includes(
								target.name
							) }
							onClick={ () =>
								selectTarget(
									target.name,
									! selectedTargetNames.includes(
										target.name
									)
								)
							}
							{ ...target }
						/>
					) ) }
				</ul>
			) }

			<div className="nelio-content-target-selector__actions">
				<Button
					variant="secondary"
					className="nelio-content-target-selector__cancel-action"
					onClick={ close }
				>
					{ _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>

				<SaveButton
					className="nelio-content-target-selector__save-action"
					disabled={ isLoading }
					onClick={ saveSelection }
				/>
			</div>
		</Modal>
	);
};
