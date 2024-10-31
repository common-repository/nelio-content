/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
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
import NelioContentLogo from '~/nelio-content-images/full-logo.svg';

export type UnscheduledPostsProps = {
	readonly className?: string;
};

export const SubscribeSidebar = ( {
	className = '',
}: UnscheduledPostsProps ): JSX.Element => {
	const today = useSelect( ( select ) => select( NC_DATA ).getToday() );
	const subscribeLink = getSubscribeLink( today, 'calendar-sidebar' );
	const subscribeLabel = getSubscribeLabel( today );
	return (
		<div
			className={ classnames( {
				'nelio-content-calendar-subscribe-sidebar': true,
				[ className ]: true,
			} ) }
		>
			<div className="nelio-content-calendar-subscribe-sidebar__logo">
				<NelioContentLogo />
			</div>
			<p>
				<strong>
					{ _x(
						'Maximize the potential of your blog with Nelio Content Premium',
						'text',
						'nelio-content'
					) }
				</strong>
			</p>
			<p>
				{ _x(
					'Streamline your content creation, scheduling, and promotion on all relevant social platforms, including X, Bluesky, Instagram, or Threads.',
					'text',
					'nelio-content'
				) }
			</p>
			<div className="nelio-content-calendar-subscribe-sidebar__button-wrapper">
				<ExternalLink
					className="nelio-content-calendar-subscribe-sidebar__subscribe-button components-button is-primary"
					href={ subscribeLink }
				>
					{ subscribeLabel }
				</ExternalLink>
				<p>
					{ _x(
						'30-day money-back guarantee',
						'text',
						'nelio-content'
					) }
				</p>
			</div>
			<div className="nelio-content-calendar-subscribe-sidebar__extra-features">
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
				</ul>
			</div>
		</div>
	);
};
