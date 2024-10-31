/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Account, AccountWithSubscription } from '@nelio-content/types';

export type TitleProps = {
	readonly plan: Account[ 'plan' ];
	readonly period: AccountWithSubscription[ 'period' ];
	readonly isCanceled: boolean;
	readonly isInvitation: boolean;
};

export const Title = ( {
	plan,
	period,
	isCanceled,
	isInvitation,
}: TitleProps ): JSX.Element => (
	<h3 className="nelio-content-plan__title">
		{ getTitle( plan ) ?? getTitle( 'basic' ) }

		<span className="nelio-content-plan__period">
			{ isInvitation && _x( 'Invitation', 'text', 'nelio-content' ) }
			{ ! isInvitation &&
				'month' === period &&
				_x( 'Monthly', 'text', 'nelio-content' ) }
			{ ! isInvitation &&
				'year' === period &&
				_x( 'Yearly', 'text', 'nelio-content' ) }
		</span>

		{ isCanceled && (
			<span className="nelio-content-plan__state-canceled">
				{ _x( 'Canceled', 'text (account state)', 'nelio-content' ) }
			</span>
		) }
	</h3>
);

function getTitle( plan: Account[ 'plan' ] ) {
	switch ( plan ) {
		case 'free':
			return _x( 'Nelio Content (Free)', 'text', 'nelio-content' );

		case 'plus':
			return _x( 'Nelio Content Plus', 'text', 'nelio-content' );

		case 'standard':
			return _x( 'Nelio Content Standard', 'text', 'nelio-content' );

		case 'basic':
			return _x( 'Nelio Content Basic', 'text', 'nelio-content' );
	} //end switch
} //end getTitle()
