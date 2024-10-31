/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual, mapValues, some, values } from 'lodash';
import { SaveButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../store';
import {
	useIsNewMessage,
	useIsRecurringMessage,
	useIsSaving,
	useValidationError,
} from '../../hooks';
import { isRecurringMessage, isRecurringSource } from '@nelio-content/utils';

export const Actions = (): JSX.Element => {
	const isNew = useIsNewMessage();
	const isDirty = useIsDirty();
	const isRecurringSave = useIsRecurringSave();
	const [ error ] = useValidationError();
	const isSaving = useIsSaving();
	const { close, saveAndClose } = useDispatch( NC_SOCIAL_EDITOR );

	return (
		<div className="nelio-content-social-message-editor__actions">
			{ !! error && (
				<div className="nelio-content-social-message-editor__error-summary">
					<span>
						<Dashicon icon="warning" />
					</span>
					<span>{ error }</span>
				</div>
			) }

			<Button variant="secondary" disabled={ isSaving } onClick={ close }>
				{ _x( 'Cancel', 'command', 'nelio-content' ) }
			</Button>

			{ isRecurringSave ? (
				<SaveRecurringButton />
			) : (
				<SaveButton
					variant="primary"
					disabled={ isNew ? undefined : ! isDirty }
					error={ error }
					isSaving={ isSaving }
					isUpdate={ ! isNew }
					onClick={ saveAndClose }
				/>
			) }
		</div>
	);
};

// =======
// HELPERS
// =======

const SaveRecurringButton = () => {
	const isNew = useIsNewMessage();
	const isDirty = useIsDirty();
	const [ isVisible, setVisible ] = useState( false );
	const [ error ] = useValidationError();
	const isSaving = useIsSaving();
	const { saveAndClose } = useDispatch( NC_SOCIAL_EDITOR );

	const saveCurrent = () => {
		setVisible( false );
		return saveAndClose( 'removing-recurrence' );
	};

	const saveFollowing = () => {
		setVisible( false );
		return saveAndClose();
	};

	return (
		<>
			{ isVisible && (
				<Modal
					title={ _x(
						'Recurring Message Update',
						'text',
						'nelio-content'
					) }
					isDismissible={ false }
					onRequestClose={ () => void null }
				>
					<div className="nelio-content-social-message-editor__recurring-dialog">
						<Button variant="secondary" onClick={ saveCurrent }>
							{ _x(
								'Save This Message',
								'command',
								'nelio-content'
							) }
						</Button>
						<Button variant="primary" onClick={ saveFollowing }>
							{ _x(
								'Save This and Following Messages',
								'command',
								'nelio-content'
							) }
						</Button>
					</div>
				</Modal>
			) }
			<SaveButton
				variant="primary"
				disabled={ isNew ? undefined : ! isDirty }
				error={ error }
				isSaving={ isSaving }
				isUpdate={ ! isNew }
				onClick={ () => setVisible( true ) }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useIsRecurringSave = (): boolean => {
	const context = useEditorContext();
	const isNew = useIsNewMessage();
	const [ isRecurring ] = useIsRecurringMessage();
	const message = useDataMessage();

	if ( isNew || ! isRecurring ) {
		return false;
	} //end if

	if ( context === 'post' ) {
		return false;
	} //end if

	if ( isRecurringMessage( message ) && isRecurringSource( message ) ) {
		return false;
	} //end if

	return true;
};

const useEditorContext = () =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).getEditorContext() );

const useDataMessage = () =>
	useSelect( ( select ) =>
		select( NC_DATA ).getSocialMessage( select( NC_SOCIAL_EDITOR ).getId() )
	);

const useIsDirty = () => {
	const message = useDataMessage();
	return useSelect( ( select ) => {
		select( NC_SOCIAL_EDITOR );
		if ( ! message ) {
			return true;
		} //end if

		const profileId =
			select( NC_SOCIAL_EDITOR ).getSelectedSocialProfiles()[ 0 ];
		const targetName = profileId
			? select( NC_SOCIAL_EDITOR ).getSelectedTargetsInProfile(
					profileId
			  )?.[ 0 ]
			: undefined;
		const attrs: Partial< SocialMessage > = {
			profileId,
			targetName,
			text: select( NC_SOCIAL_EDITOR ).getText(),
			postId: select( NC_SOCIAL_EDITOR ).getPost()?.id,
			dateType: select( NC_SOCIAL_EDITOR ).getDateType(),
			dateValue: select( NC_SOCIAL_EDITOR ).getDateValue(),
			timeType: select( NC_SOCIAL_EDITOR ).getTimeType(),
			timeValue: select( NC_SOCIAL_EDITOR ).getTimeValue(),
			image: select( NC_SOCIAL_EDITOR ).hasExplicitImage()
				? select( NC_SOCIAL_EDITOR ).getImageUrl()
				: undefined,
			video: select( NC_SOCIAL_EDITOR ).getVideoUrl(),
		};

		const recSettings = select( NC_SOCIAL_EDITOR ).isRecurrenceEnabled()
			? select( NC_SOCIAL_EDITOR ).getRecurrenceSettings()
			: undefined;

		if ( ! isEqual( message.recurrenceSettings, recSettings ) ) {
			return true;
		} //end if

		const diffs = mapValues(
			attrs,
			( val, name ) => message[ name ] !== val
		);
		return some( values( diffs ) );
	} );
};
