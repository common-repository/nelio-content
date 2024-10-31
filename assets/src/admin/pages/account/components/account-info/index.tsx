/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { dateI18n } from '@nelio-content/date';
import { getFirstLatinizedLetter } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { RemoveLicenseAction, ApplyLicenseAction } from '../actions';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

const DATE_FORMAT = _x( 'Y-m-d', 'text (date)', 'nelio-content' );

export const AccountInfo = (): JSX.Element | null => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);

	if ( account.plan === 'free' ) {
		return null;
	} //end if

	const { creationDate, firstname, lastname, license, email, photo } =
		account;
	const fullname = sprintf(
		/* translators: 1 -> first name, 2 -> lastname */
		_x( '%1$s %2$s', 'text (full name)', 'nelio-content' ),
		firstname,
		lastname
	);

	const firstLetter = getFirstLatinizedLetter( fullname ) || 'a';

	return (
		<div className="nelio-content-account-container__box nelio-content-info">
			<h3 className="nelio-content-info__title">
				{ _x(
					'Account Information',
					'title (account)',
					'nelio-content'
				) }
			</h3>

			<div className="nelio-content-info__container">
				<div className="nelio-content-info__profile">
					<div
						className={ `nelio-content-info__picture nelio-content-first-letter-${ firstLetter }` }
					>
						<div
							className="nelio-content-info__actual-picture"
							style={ {
								backgroundImage: `url(${ photo })`,
							} }
						></div>
					</div>
				</div>

				<div className="nelio-content-info__details">
					<p className="nelio-content-info__name">{ fullname }</p>
					<p className="nelio-content-info__email">
						<Dashicon
							icon="email"
							className="nelio-content-info__icon"
						/>
						{ email }
					</p>
					<p className="nelio-content-info__creation-date">
						<Dashicon
							icon="calendar"
							className="nelio-content-info__icon"
						/>
						{ createInterpolateElement(
							sprintf(
								/* translators: a date */
								_x(
									'Member since %s.',
									'text',
									'nelio-content'
								),
								`<date>${ dateI18n(
									DATE_FORMAT,
									creationDate
								) }</date>`
							),
							{
								date: <strong />,
							}
						) }
					</p>
					<div className="nelio-content-info__license">
						<Dashicon
							icon="admin-network"
							className="nelio-content-info__icon"
						/>
						<code
							title={ _x(
								'License Key',
								'text',
								'nelio-content'
							) }
						>
							{ license }
						</code>
						<div className="nelio-content-info__change-license">
							<ApplyLicenseAction
								variant="link"
								label={ _x(
									'Change',
									'command',
									'nelio-content'
								) }
							/>
						</div>
						<div className="nelio-content-info__remove-license">
							<RemoveLicenseAction
								variant="link"
								isDestructive
								label={ _x(
									'Remove',
									'command',
									'nelio-content'
								) }
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
