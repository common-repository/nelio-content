/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink, Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { Invoice } from '../invoice';

import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export const Billing = (): JSX.Element | null => {
	const invoices = useInvoices();
	const isLoading = useIsLoading();
	const isVisible = useIsVisible();
	const urlToManagePayments = usePaymentsUrl();

	if ( ! isVisible ) {
		return null;
	} //end if

	if ( isLoading ) {
		return (
			<div className="nelio-content-account-container__box nelio-content-billing">
				<h3 className="nelio-content-billing__title">
					{ _x( 'Billing History', 'text', 'nelio-content' ) }
					{ isLoading && <Spinner /> }
				</h3>
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-account-container__box nelio-content-billing">
			<h3 className="nelio-content-billing__title">
				{ _x( 'Billing History', 'text', 'nelio-content' ) }
			</h3>

			{ !! urlToManagePayments && (
				<ExternalLink
					className="nelio-content-billing__action"
					href={ urlToManagePayments }
				>
					{ _x( 'Manage Payments', 'command', 'nelio-content' ) }
				</ExternalLink>
			) }

			<table className="nelio-content-billing__container">
				<thead>
					<tr>
						<th className="nelio-content-billing__reference">
							{ _x(
								'Invoice Reference',
								'text (account, billing table title)',
								'nelio-content'
							) }
						</th>
						<th className="nelio-content-billing__date">
							{ _x(
								'Date',
								'text (account, billing table title)',
								'nelio-content'
							) }
						</th>
						<th className="nelio-content-billing__total">
							{ _x(
								'Total',
								'text (account, billing table title)',
								'nelio-content'
							) }
						</th>
					</tr>
				</thead>

				<tbody className="invoice-list">
					{ invoices.map( ( invoice ) => (
						<Invoice key={ invoice.reference } { ...invoice } />
					) ) }
				</tbody>
			</table>
		</div>
	);
};

// =====
// HOOKS
// =====

const useInvoices = () =>
	useSelect( ( select ) => select( NC_ACCOUNT ).getInvoices() || [] );

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NC_ACCOUNT ).hasFinishedResolution( 'getInvoices' )
	);

const useIsVisible = () =>
	useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return 'free' !== account.plan && 'regular' === account.mode;
	} );

const usePaymentsUrl = () =>
	useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return 'free' === account.plan ? '' : account.urlToManagePayments;
	} );
