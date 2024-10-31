/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, VisuallyHidden } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useCanEditRecurrence,
	useDoesActiveNetworkSupport,
	useIsEditingRecurrenceSettings,
	useIsRecurringMessage,
	useRecurrenceSummary,
} from '../../hooks';

export const RecurrenceSummary = (): JSX.Element | null => {
	const supportsRecurrence = useDoesActiveNetworkSupport( 'recurrence' );
	const canEditRecurrence = useCanEditRecurrence();
	const [ isRecurring ] = useIsRecurringMessage();
	const [ _, editRecurrenceSettings ] = useIsEditingRecurrenceSettings();
	const recurrenceSummary = useRecurrenceSummary();

	if ( ! supportsRecurrence ) {
		return null;
	} //end if

	if ( ! isRecurring ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-social-message-editor__recurrence-summary">
			<Dashicon icon="controls-repeat" />
			<VisuallyHidden>
				{ _x( 'Repeats', 'text', 'nelio-content' ) + ': ' }
			</VisuallyHidden>{ ' ' }
			{ canEditRecurrence ? (
				<Button
					variant="link"
					onClick={ () => editRecurrenceSettings( true ) }
				>
					{ recurrenceSummary }
				</Button>
			) : (
				<>{ recurrenceSummary }</>
			) }
		</div>
	);
};
