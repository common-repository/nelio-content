/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

export const EmailSetting = (): JSX.Element => {
	const [ email, setEmail ] = useEmail();
	return (
		<>
			<div className="nelio-content-profile-settings-dialog__title">
				{ _x( 'Fallback Email', 'text', 'nelio-content' ) }
			</div>
			<TextControl
				value={ email }
				onChange={ setEmail }
				placeholder={ _x( 'Email', 'text', 'nelio-content' ) }
				help={ _x(
					'Nelio Content will use this email to let the recipient know when a social message couldn’t be shared, thus offering them the opportunity to manually share it.',
					'text',
					'nelio-content'
				) }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useEmail = () => {
	const email = useSelect( ( select ) =>
		trim( select( NC_PROFILE_SETTINGS ).getEditingEmail() ).replace(
			/^mailto:/i,
			''
		)
	);
	const { setEditingEmail } = useDispatch( NC_PROFILE_SETTINGS );
	return [ email, setEditingEmail ] as const;
};
