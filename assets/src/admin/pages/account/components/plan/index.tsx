/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

import { Explanation } from './explanation';
import { Title } from './title';
import {
	CancelSubscriptionAction,
	ReactivateSubscriptionAction,
	TweetAction,
	UpgradeSubscription,
} from '../actions';

export const Plan = (): JSX.Element | null => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);

	if ( account.plan === 'free' ) {
		return null;
	} //end if

	const { mode, state, plan, period } = account;

	return (
		<div className="nelio-content-account-container__box nelio-content-plan">
			<div className="nelio-content-plan__content">
				<Title
					isCanceled={ 'canceled' === state }
					isInvitation={ 'invitation' === mode }
					plan={ plan }
					period={ period }
				/>
				<Explanation />
			</div>

			<div className="nelio-content-plan__actions">
				{ 'invitation' === mode && <TweetAction /> }

				{ 'invitation' !== mode && 'active' === state && (
					<>
						<CancelSubscriptionAction />
						<UpgradeSubscription />
					</>
				) }

				{ 'invitation' !== mode && 'canceled' === state && (
					<ReactivateSubscriptionAction />
				) }
			</div>
		</div>
	);
};
