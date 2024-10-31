/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink, Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_DATA } from '@nelio-content/data';
import {
	PREMIUM_FEATURES,
	getSubscribeLink,
	getUnlockLabel,
} from '@nelio-content/utils';
import type { PremiumFeature } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import NelioContentIcon from '../../../assets/src/images/logo.svg';

export const PremiumDialog = (): JSX.Element | null => {
	const { isSubscribed, today, feature, pluginsUrl, premiumStatus } =
		useSelect( ( select ) => ( {
			isSubscribed: select( NC_DATA ).isSubscribed(),
			today: select( NC_DATA ).getToday(),
			feature: select( NC_DATA ).getPremiumDialog(),
			pluginsUrl: select( NC_DATA ).getAdminUrl( 'plugins.php' ),
			premiumStatus: select( NC_DATA ).getPremiumStatus(),
		} ) );

	const isInstalled = 'uninstalled' !== premiumStatus;

	if ( 'none' === feature ) {
		return null;
	} //end if

	const banner = FEATURE_BANNERS[ feature ];
	const subscribeUrl = getSubscribeLink( today, feature );
	const subscribeLabel = getUnlockLabel( today );
	const installPremiumLabel = isInstalled
		? _x( 'Activate Nelio Content Premium', 'text', 'nelio-content' )
		: _x( 'Install Nelio Content Premium', 'text', 'nelio-content' );

	return (
		<Modal
			className={ classnames( 'nelio-content-premium-dialog' ) }
			title={ ( <Title /> ) as unknown as string }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<p>
				<strong>{ banner.subtitle }</strong>
			</p>
			<p>{ banner.paragraph }</p>
			<div className="nelio-content-premium-dialog__button-wrapper">
				<ExternalLink
					className="nelio-content-premium-dialog__subscribe-button components-button is-primary"
					href={ isSubscribed ? pluginsUrl : subscribeUrl }
				>
					{ isSubscribed ? installPremiumLabel : subscribeLabel }
				</ExternalLink>
				<p>
					{ ! isSubscribed &&
						_x(
							'30-day money-back guarantee',
							'text',
							'nelio-content'
						) }
				</p>
			</div>
			{ ! isSubscribed && (
				<div className="nelio-content-premium-dialog__extra-features">
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
						{ PREMIUM_FEATURES.map(
							( { name, description }, i ) => (
								<li key={ i }>
									<strong>{ name }</strong>
									{ ` ${ description }` }
								</li>
							)
						) }
					</ul>
				</div>
			) }
		</Modal>
	);
};

// =======
// HELPERS
// =======

const Title = () => {
	const { closePremiumDialog } = useDispatch( NC_DATA );
	const feature = useSelect( ( select ) =>
		select( NC_DATA ).getPremiumDialog()
	);

	const banner = FEATURE_BANNERS[ feature ];
	return (
		<div className="nelio-content-premium-dialog__custom-header">
			<NelioContentIcon />
			<span className="nelio-content-premium-dialog__custom-header-title">
				{ banner.title }
			</span>
			<span>
				<button
					type="button"
					className="components-button has-icon"
					aria-label={ _x( 'Close', 'command', 'nelio-content' ) }
					onClick={ closePremiumDialog }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						aria-hidden="true"
						focusable="false"
					>
						<path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
					</svg>
				</button>
			</span>
		</div>
	);
};

type FeatureBanner = {
	readonly title: string;
	readonly subtitle: string;
	readonly paragraph: string;
};
const FEATURE_BANNERS: Record< 'none' | PremiumFeature, FeatureBanner > = {
	none: { title: '', subtitle: '', paragraph: '' },
	'analytics/create-messages': {
		title: _x( 'Second Chances', 'user', 'nelio-content' ),
		subtitle: _x(
			'Discover your most valuable posts and reshare them',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Nelio Content’s Analytics will show you which content is performing the best. Reshare it with your followers and reach newer audiences.',
			'user',
			'nelio-content'
		),
	},
	'calendar/create-messages': {
		title: _x( 'Schedule Social Messages', 'user', 'nelio-content' ),
		subtitle: _x(
			'Schedule and share your thoughts in a breeze',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Using Nelio’s Editorial Calendar, you can easily schedule all the publications you want on your social profiles.',
			'text',
			'nelio-content'
		),
	},
	'calendar/create-reusable-messages': {
		title: _x( 'Create Reusable Messages', 'user', 'nelio-content' ),
		subtitle: _x(
			'Evergreen messages at the tip of your fingers',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Write recurring topics once and use them when needed by simply dragging-and-dropping your messages into the calendar.',
			'user',
			'nelio-content'
		),
	},
	'calendar/create-tasks': {
		title: _x( 'Editorial Tasks', 'user', 'nelio-content' ),
		subtitle: _x(
			'Get things done once and for all',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Keep track of all your tasks by creating them in your calendar and assigning them to your team members.',
			'user',
			'nelio-content'
		),
	},
	'calendar/edit-reusable-messages': {
		title: _x( 'Edit Reusable Messages', 'user', 'nelio-content' ),
		subtitle: _x(
			'Evergreen messages at the tip of your fingers',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Write recurring topics once and use them when needed by simply dragging-and-dropping your messages into the calendar.',
			'user',
			'nelio-content'
		),
	},
	'calendar/export': {
		title: _x( 'Export Your Calendar', 'user', 'nelio-content' ),
		subtitle: _x(
			'Export your calendar in multiple formats and take it with you',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Download your calendar as CSV or generate a custom link to integrate your blog posts into external tools like Google Calendar.',
			'user',
			'nelio-content'
		),
	},
	'calendar/schedule-reusable-messages': {
		title: _x( 'Schedule Reusable Messages', 'user', 'nelio-content' ),
		subtitle: _x(
			'Evergreen messages at the tip of your fingers',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Write recurring topics once and use them when needed by simply dragging-and-dropping your messages into the calendar.',
			'user',
			'nelio-content'
		),
	},
	'edit-post/create-more-messages': {
		title: _x( 'Reach More People', 'user', 'nelio-content' ),
		subtitle: _x(
			'Write as many social publications as you need',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Make sure the content of your blog is read on social media and send multiple messages that span across multiple days.',
			'user',
			'nelio-content'
		),
	},
	'edit-post/custom-timeline': {
		title: _x( 'Lasting Promotions', 'user', 'nelio-content' ),
		subtitle: _x(
			'Promote your content upon publication and during the next few days',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Make sure your blog posts reach your audience and share it on multiple social platforms across several days.',
			'user',
			'nelio-content'
		),
	},
	'feeds/share-post': {
		title: _x( 'Share Your Feeds', 'user', 'nelio-content' ),
		subtitle: _x(
			'Give your readers the value they deserve',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Share posts from your favorite feeds and keep your followers informed with valuable content.',
			'user',
			'nelio-content'
		),
	},
	'raw/automation-groups': {
		title: _x( 'Automate your Social Media', 'user', 'nelio-content' ),
		subtitle: _x(
			'Customize what you share and how you share it',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Define custom templates for each of your social accounts, select which content should be share, where, and how, and let Nelio Content take care of the rest.',
			'user',
			'nelio-content'
		),
	},
	'raw/editorial-comments': {
		title: _x( 'Talk to Your Team', 'user', 'nelio-content' ),
		subtitle: _x(
			'Discuss with your team the status of your upcoming posts',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Keep track of all the conversations you’ve had and make sure you’re all on the same page.',
			'user',
			'nelio-content'
		),
	},
	'raw/editorial-tasks': {
		title: _x( 'Editorial Tasks', 'user', 'nelio-content' ),
		subtitle: _x(
			'Keep track of all the important work ahead',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Make sure everyone know what they have to do by creating and assigning editorial tasks and don’t miss any more deadlines.',
			'user',
			'nelio-content'
		),
	},
	'raw/free-previews': {
		title: _x( 'Thorough Sharing Experience', 'text', 'nelio-content' ),
		subtitle: _x(
			'Let Nelio Content take care of your inbound marketing strategy',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Our plugin can create unique social messages based on the content of your blog post, creating an engaging set of publications that your followers will love.',
			'text',
			'nelio-content'
		),
	},
	'raw/future-actions': {
		title: _x( 'Future Actions', 'user', 'nelio-content' ),
		subtitle: _x(
			'Automate your workflow with future actions',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Schedule automatic changes to your posts, pages, and other content types.',
			'user',
			'nelio-content'
		),
	},
	'raw/task-presets': {
		title: _x( 'Standardize Your Workflow', 'user', 'nelio-content' ),
		subtitle: _x(
			'Create task presets and instantiate them when creating new blog posts',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'If you find yourself repeating the same tasks over and over again for each post in your blog, create a simple task preset and save time and energy. Don’t repeat yourself.',
			'user',
			'nelio-content'
		),
	},
	'settings/more-profiles': {
		title: _x( 'All Your Social Accounts', 'user', 'nelio-content' ),
		subtitle: _x(
			'Let all your followers know about your content',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Connect your social accounts on all supported platforms and let Nelio Content share your blog posts for you.',
			'user',
			'nelio-content'
		),
	},
	'settings/more-profiles-in-network': {
		title: _x( 'Multiple Accounts per Network', 'user', 'nelio-content' ),
		subtitle: _x(
			'Let all your followers know about your content',
			'user',
			'nelio-content'
		),
		paragraph: _x(
			'Connect multiple profiles on the same platform and let Nelio Content take care of the rest.',
			'user',
			'nelio-content'
		),
	},
};
