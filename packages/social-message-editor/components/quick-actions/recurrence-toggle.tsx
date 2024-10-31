/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useIsSubscribed } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import {
	useCanToggleRecurrence,
	useDoesActiveNetworkSupport,
	useIsRecurringMessage,
} from '../../hooks';

export type RecurrenceToggleProps = {
	readonly disabled?: boolean;
};

export const RecurrenceToggle = ( {
	disabled,
}: RecurrenceToggleProps ): JSX.Element | null => {
	const supportsRecurrence = useDoesActiveNetworkSupport( 'recurrence' );
	const canToggleRecurrence = useCanToggleRecurrence();
	const canUseRecurrence = useIsSubscribed();
	const [ isRecurring, setRecurring ] = useIsRecurringMessage();

	if ( ! supportsRecurrence ) {
		return null;
	} //end if

	if ( ! canToggleRecurrence ) {
		return null;
	} //end if

	if ( ! canUseRecurrence ) {
		return null;
	} //end if

	return (
		<Button
			className={ classnames( {
				'nelio-content-social-message-editor__quick-action': true,
				'nelio-content-social-message-editor__quick-action--is-recurring':
					true,
				'nelio-content-social-message-editor__quick-action--is-toggled':
					isRecurring,
			} ) }
			icon="controls-repeat"
			label={ _x( 'Recurring Message', 'text', 'nelio-content' ) }
			tooltipPosition="bottom center"
			isPressed={ isRecurring }
			disabled={ disabled }
			onClick={ () => setRecurring( ! isRecurring ) }
		/>
	);
};
