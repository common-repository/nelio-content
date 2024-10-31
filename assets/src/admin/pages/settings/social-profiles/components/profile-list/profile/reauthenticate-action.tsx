/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Tooltip } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

export type ReauthenticateActionProps = {
	readonly disabled?: boolean;
	readonly isUserAllowed?: boolean;
	readonly onClick: () => void;
};

export const ReauthenticateAction = ( {
	disabled,
	isUserAllowed,
	onClick,
}: ReauthenticateActionProps ): JSX.Element => (
	<div className="nelio-content-profile__reauthenticate-action">
		{ isUserAllowed ? (
			<Button
				variant="secondary"
				disabled={ disabled }
				onClick={ onClick }
			>
				{ _x( 'Re-Authenticate', 'command', 'nelio-content' ) }
			</Button>
		) : (
			<Tooltip
				placement="bottom"
				text={ _x(
					'Only the user who added this profile can re-authenticate it',
					'user',
					'nelio-content'
				) }
				{ ...{ delay: 0 } }
			>
				<span style={ { opacity: 0.8 } }>
					{ _x( 'Re-Authenticate', 'command', 'nelio-content' ) }
				</span>
			</Tooltip>
		) }
	</div>
);
