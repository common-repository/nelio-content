/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { dateI18n } from '@nelio-content/date';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

const DATE_FORMAT = _x( 'Y-m-d', 'text (date)', 'nelio-content' );

export const Explanation = (): JSX.Element | null => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);

	if ( account.plan === 'free' ) {
		return null;
	} //end if

	const { mode, deactivationDate, nextChargeDate, nextChargeTotal, state } =
		account;

	if ( 'invitation' === mode ) {
		return (
			<div className="nelio-content-plan__renewal">
				{ _x(
					'You’re currently using a Free Pass to Nelio Content’s Premium Features. Enjoy the plugin and, please, help us improve it with your feedback!',
					'text',
					'nelio-content'
				) }
			</div>
		);
	} //end if

	if ( 'canceled' === state ) {
		return (
			<div className="nelio-content-plan__renewal">
				{ createInterpolateElement(
					sprintf(
						/* translators: a date */
						_x(
							'Your subscription will end on %s.',
							'text',
							'nelio-content'
						),
						`<date>${ dateI18n(
							DATE_FORMAT,
							deactivationDate
						) }</date>`
					),
					{
						date: (
							<span className="nelio-content-plan__renewal-date" />
						),
					}
				) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-plan__renewal">
			{ createInterpolateElement(
				sprintf(
					/* translators: 1 -> price and currency; 2 -> date */
					_x(
						'Next charge will be %1$s on %2$s.',
						'text',
						'nelio-content'
					),
					`<money>${ nextChargeTotal }</money>`,
					`<date>${ dateI18n( DATE_FORMAT, nextChargeDate ) }</date>`
				),
				{
					date: <span className="nelio-content-plan__renewal-date" />,
					money: (
						<span className="nelio-content-plan__renewal-amount" />
					),
				}
			) }
		</div>
	);
};
