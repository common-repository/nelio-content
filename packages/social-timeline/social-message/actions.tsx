/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { DeleteButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import { isRecurringMessage } from '@nelio-content/utils';
import type { Maybe, Post, SocialMessage, Uuid } from '@nelio-content/types';

export type ActionsProps = {
	readonly message: Maybe< SocialMessage >;
	readonly post: Post;
	readonly isBeingDeleted: boolean;
	readonly isTimelineBusy?: boolean;
	readonly deleteMessage?: ( id: Uuid ) => void;
};

export const Actions = ( {
	message,
	deleteMessage,
	isBeingDeleted,
	isTimelineBusy,
	post,
}: ActionsProps ): JSX.Element => {
	const canEditMessage = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserEditSocialMessage( message )
	);
	const canDeleteMessage = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserDeleteSocialMessage( message )
	);

	const editMessage = useMessageEditor( message, post );

	const isEditable = ! [ 'error', 'publish' ].includes(
		message?.status ?? ''
	);
	const viewLabel = _x( 'View', 'command', 'nelio-content' );
	const editLabel = isRecurringMessage( message )
		? _x( 'Edit All', 'command (all recurring messages)', 'nelio-content' )
		: _x( 'Edit', 'command', 'nelio-content' );

	return (
		<div
			className={ classnames( {
				'nelio-content-social-message__actions': true,
				'nelio-content-social-message__actions--is-deleting':
					isBeingDeleted,
			} ) }
		>
			{ ! isBeingDeleted && (
				<Button
					variant="link"
					disabled={ ! canEditMessage || isTimelineBusy }
					onClick={ editMessage }
				>
					{ isEditable ? editLabel : viewLabel }
				</Button>
			) }
			{ ! isBeingDeleted && !! deleteMessage && <span>{ '|' }</span> }
			{ !! deleteMessage && (
				<DeleteButton
					isDeleting={ isBeingDeleted }
					onClick={ () =>
						void ( !! message?.id && deleteMessage( message.id ) )
					}
					disabled={ ! canDeleteMessage || isTimelineBusy }
					labels={ {
						delete: isRecurringMessage( message )
							? _x(
									'Delete All',
									'command (all recurring messages)',
									'nelio-content'
							  )
							: _x( 'Delete', 'command', 'nelio-content' ),
						deleting: _x( 'Deleting…', 'text', 'nelio-content' ),
					} }
					confirmationLabels={ {
						title: isRecurringMessage( message )
							? _x(
									'Delete Recurring Social Message',
									'text',
									'nelio-content'
							  )
							: _x(
									'Delete Social Message',
									'text',
									'nelio-content'
							  ),
						text: isRecurringMessage( message )
							? _x(
									'Are you sure you want to delete this recurring social message and all its following instances? This operation can’t be undone.',
									'user',
									'nelio-content'
							  )
							: _x(
									'Are you sure you want to delete this social message? This operation can’t be undone.',
									'user',
									'nelio-content'
							  ),
					} }
				/>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useMessageEditor = ( message: Maybe< SocialMessage >, post: Post ) => {
	const { openSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	return () =>
		void (
			!! message &&
			openSocialMessageEditor( message, {
				context: 'post',
				post,
			} )
		);
};
