/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import {
	PREMIUM_FEATURES,
	getSubscribeLabel,
	getSubscribeLink,
} from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { LicensePopover } from './license-popover';
import NelioContentLogo from '../../../assets/src/images/full-logo.svg';

export type SubscriptionRequiredPageProps = {
	readonly page: 'account' | 'content-board';
};

export const SubscriptionRequiredPage = ( {
	page,
}: SubscriptionRequiredPageProps ): JSX.Element => {
	const { title, subtitle } = TITLES[ page ];
	const [ isVisible, setVisible ] = useState( false );
	const [ isLocked, lock ] = useState( false );

	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );
	const subscribeLink = getSubscribeLink( today, 'calendar-sidebar' );
	const subscribeLabel = getSubscribeLabel( today );

	return (
		<div className="nelio-content-subscription-required-page">
			<div className="nelio-content-subscription-required-page__primary">
				<div className="nelio-content-subscription-required-page__logo">
					<NelioContentLogo />
				</div>
				<p>
					<strong>{ title }</strong>
				</p>
				<p>{ subtitle }</p>
				<div className="nelio-content-subscription-required-page__button-wrapper">
					<div>
						<ExternalLink
							className="nelio-content-subscription-required-page__subscribe-button components-button is-primary"
							href={ isLocked ? '#' : subscribeLink }
						>
							{ subscribeLabel }
						</ExternalLink>
					</div>
					<p>
						{ _x(
							'Do you already have a valid subscription?',
							'text',
							'nelio-content'
						) }{ ' ' }
						<span>
							<Button
								variant="link"
								className="nelio-content-subscription-required-page__use-license"
								onClick={ () => setVisible( true ) }
								disabled={ isLocked }
							>
								{ _x(
									'Enter License',
									'command',
									'nelio-content'
								) }
							</Button>
							<LicensePopover
								onFocusOutside={ () => setVisible( false ) }
								isOpen={ isVisible }
								isLocked={ isLocked }
								lock={ lock }
							/>
						</span>
					</p>
				</div>
			</div>
			<div className="nelio-content-subscription-required-page__extra-features">
				<p>
					<strong>
						{ _x(
							'Nelio Content Premium also gives you:',
							'text',
							'nelio-content'
						) }
					</strong>
				</p>
				<ul>
					{ PREMIUM_FEATURES.map( ( { name, description }, i ) => (
						<li key={ i }>
							<strong>{ name }</strong>
							{ ` ${ description }` }
						</li>
					) ) }
					<li>
						<strong>
							{ _x(
								'30-day money-back guarantee.',
								'text',
								'nelio-content'
							) }
						</strong>
					</li>
				</ul>
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

const TITLES: Record<
	SubscriptionRequiredPageProps[ 'page' ],
	{ title: string; subtitle: string }
> = {
	account: {
		title: _x(
			'Maximize the potential of your blog with Nelio Content Premium',
			'user',
			'nelio-content'
		),
		subtitle: _x(
			'Streamline your content creation, scheduling, and promotion on all relevant social platforms, including X, Bluesky, Instagram, or Threads.',
			'user',
			'nelio-content'
		),
	},
	'content-board': {
		title: _x(
			'Manage all your content with Nelio Content Premium',
			'user',
			'nelio-content'
		),
		subtitle: _x(
			'Get Nelio Content’s Board today—a Kanban-like view that makes it easy to monitor and manage WordPress content.',
			'user',
			'nelio-content'
		),
	},
};
