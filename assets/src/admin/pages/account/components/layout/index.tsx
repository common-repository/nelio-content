/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { SubscriptionRequiredPage } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';

import { Plan } from '../plan';
import { AgencyPlan } from '../plan/agency-plan';

import { AccountInfo } from '../account-info';
import { Billing } from '../billing';
import { Sites } from '../sites';

import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export const Layout = (): JSX.Element | null => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);
	const isAccountReady = useSelect( ( select ) =>
		select( NC_ACCOUNT ).hasFinishedResolution( 'getAccount' )
	);

	if ( ! isAccountReady ) {
		return null;
	} //end if

	if ( 'free' === account.plan ) {
		return (
			<div className="nelio-content-account-container nelio-content-account-container--free-user">
				<SubscriptionRequiredPage page="account" />
			</div>
		);
	} //end if

	if ( account.isAgency ) {
		return (
			<div className="nelio-content-account-container nelio-content-account-container--is-agency-summary">
				<AgencyPlan />
			</div>
		);
	} //end if

	const isInvitation = account.mode === 'invitation';
	const isMultiSite = 1 < account.sitesAllowed;

	return (
		<div
			className={ classnames( 'nelio-content-account-container', {
				'nelio-content-account-container--is-invitation': isInvitation,
				'nelio-content-account-container--is-subscribed':
					! isInvitation,
				'nelio-content-account-container--is-multi-site': isMultiSite,
			} ) }
		>
			<Plan />
			<AccountInfo />
			<Sites />
			<Billing />
		</div>
	);
};
