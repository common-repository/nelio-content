/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { assertUnreachable } from '@nelio-content/utils';
import type { RecurringAction } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export const RecurringDialog = (): JSX.Element | null => {
	const action = useSelect( ( select ) =>
		select( NC_CALENDAR ).getRecurringAction()
	);
	const {
		closeRecurringDialog,
		deleteSocialMessage,
		rescheduleSocialMessage,
	} = useDispatch( NC_CALENDAR );

	if ( ! action ) {
		return null;
	} //end if

	const { type } = action;

	const labels = getLabels( type );

	const applyOne = () => {
		switch ( type ) {
			case 'trash':
				void deleteSocialMessage( action.props.id );
				void closeRecurringDialog();
				break;
			case 'reschedule':
				void rescheduleSocialMessage(
					action.props.id,
					action.props.day,
					action.props.hour,
					'disable-recurrence'
				);
				void closeRecurringDialog();
				break;
			default:
				assertUnreachable( type );
		} //end switch
	};

	const applyFollowing = () => {
		switch ( type ) {
			case 'trash':
				void deleteSocialMessage( action.props.id, 'following' );
				void closeRecurringDialog();
				break;
			case 'reschedule':
				void rescheduleSocialMessage(
					action.props.id,
					action.props.day,
					action.props.hour
				);
				void closeRecurringDialog();
				break;
			default:
				assertUnreachable( type );
		} //end switch
	};

	return (
		<Modal
			title={ labels.title }
			isDismissible={ false }
			onRequestClose={ () => void null }
		>
			<div className="nelio-content-recurring-dialog-mode">
				<Button variant="secondary" onClick={ applyOne }>
					{ labels.one }
				</Button>
				<Button variant="primary" onClick={ applyFollowing }>
					{ labels.following }
				</Button>
			</div>
		</Modal>
	);
};

// =======
// HELPERS
// =======

type Labels = {
	readonly title: string;
	readonly one: string;
	readonly following: string;
};

const getLabels = ( type: RecurringAction[ 'type' ] ): Labels => {
	switch ( type ) {
		case 'trash':
			return {
				title: _x( 'Recurring Message Trash', 'text', 'nelio-content' ),
				one: _x( 'Trash This Message', 'command', 'nelio-content' ),
				following: _x(
					'Trash This and Following Messages',
					'command',
					'nelio-content'
				),
			};

		case 'reschedule':
			return {
				title: _x(
					'Recurring Message Reschedule',
					'text',
					'nelio-content'
				),
				one: _x( 'Update This Message', 'command', 'nelio-content' ),
				following: _x(
					'Update This and Following Messages',
					'command',
					'nelio-content'
				),
			};
	} //end switch
};
