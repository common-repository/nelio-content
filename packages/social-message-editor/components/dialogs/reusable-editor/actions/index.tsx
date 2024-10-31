/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { mapValues, some, values } from 'lodash';
import { DeleteButton, SaveButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { ReusableSocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../../../store';
import { useIsSaving, useValidationError } from '../../../../hooks';

export const Actions = (): JSX.Element => {
	const messageId = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getReusableMessageId()
	);
	const isNew = ! messageId;
	const isDirty = useIsDirty();
	const [ error ] = useValidationError();
	const isSaving = useIsSaving();
	const { deleteReusableMessage } = useDispatch( NC_DATA );
	const { close, saveReusableAndClose } = useDispatch( NC_SOCIAL_EDITOR );

	const onRemove = () => {
		if ( ! messageId ) {
			return;
		} //end if
		void deleteReusableMessage( messageId );
		void close();
	};

	return (
		<div className="nelio-content-social-message-editor__actions nelio-content-social-message-editor__actions--is-reusable-message">
			{ !! error && (
				<div className="nelio-content-social-message-editor__error-summary">
					<span>
						<Dashicon icon="warning" />
					</span>
					<span>{ error }</span>
				</div>
			) }

			{ ! isNew && ! error && (
				<DeleteButton
					className="nelio-content-social-message-editor__delete-reusable-message"
					disabled={ isSaving }
					onClick={ onRemove }
				/>
			) }

			<Button variant="secondary" disabled={ isSaving } onClick={ close }>
				{ _x( 'Cancel', 'command', 'nelio-content' ) }
			</Button>

			<SaveButton
				variant="primary"
				disabled={ isNew ? undefined : ! isDirty }
				error={ error }
				isSaving={ isSaving }
				isUpdate={ ! isNew }
				onClick={ () => void saveReusableAndClose() }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useDataMessage = () =>
	useSelect( ( select ) =>
		select( NC_DATA ).getReusableMessage(
			select( NC_SOCIAL_EDITOR ).getReusableMessageId()
		)
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

		const timeType = select( NC_SOCIAL_EDITOR ).getTimeType();
		const attrs: Partial< ReusableSocialMessage > = {
			profileId,
			targetName,
			text: select( NC_SOCIAL_EDITOR ).getText(),
			postId: select( NC_SOCIAL_EDITOR ).getPost()?.id,
			timeType:
				timeType === 'exact' || timeType === 'time-interval'
					? timeType
					: 'exact',
			timeValue: select( NC_SOCIAL_EDITOR ).getTimeValue(),
			image: select( NC_SOCIAL_EDITOR ).hasExplicitImage()
				? select( NC_SOCIAL_EDITOR ).getImageUrl()
				: undefined,
			video: select( NC_SOCIAL_EDITOR ).getVideoUrl(),
		};

		const diffs = mapValues(
			attrs,
			( val, name ) => message[ name ] !== val
		);
		return some( values( diffs ) );
	} );
};
