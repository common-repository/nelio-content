/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { Invoice as InvoiceType } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export const Invoice = ( {
	invoiceUrl,
	reference,
	chargeDate,
	isRefunded,
	subtotalDisplay,
}: InvoiceType ): JSX.Element => (
	<tr className="nelio-content-invoice">
		<td className="nelio-content-invoice__reference">
			<a
				href={ invoiceUrl }
				className="nelio-content-invoice__link"
				target="_blank"
				rel="noopener noreferrer"
			>
				{ reference }
			</a>
		</td>

		<td className="nelio-content-invoice__date">{ chargeDate }</td>

		<td className="nelio-content-invoice__total">
			{ isRefunded && (
				<span className="nelio-content-invoice__label">
					{ _x( '(Refunded)', 'text (invoice)', 'nelio-content' ) }
				</span>
			) }
			<span
				className={ classnames( {
					'nelio-content-invoice__total-value': true,
					'nelio-content-invoice__total-value--refunded': isRefunded,
				} ) }
			>
				{ subtotalDisplay }
			</span>
		</td>
	</tr>
);
