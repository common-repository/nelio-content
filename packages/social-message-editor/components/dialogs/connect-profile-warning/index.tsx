/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink, Modal } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { useAdminUrl } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../../store';

export const ConnectProfileWarning = (): JSX.Element => {
	const settingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-content-settings',
		subpage: 'social--profiles',
	} );
	const { close } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<Modal
			className="nelio-content-connect-profile-warning"
			title={ _x( 'Social Profiles', 'text', 'nelio-content' ) }
			onRequestClose={ close }
		>
			<div className="nelio-content-connect-profile-warning__content">
				{ _x(
					'Nelio Content helps you to engage with your audience by sharing your WordPress content on social media. Connect one or more social profiles and then refresh this page to use them.',
					'user',
					'nelio-content'
				) }
			</div>
			<div className="nelio-content-connect-profile-warning__actions">
				<ExternalLink
					className="components-button is-primary"
					href={ settingsUrl }
					onClick={ close }
				>
					{ _x( 'Connect Profiles', 'command', 'nelio-content' ) }
				</ExternalLink>
			</div>
		</Modal>
	);
};
