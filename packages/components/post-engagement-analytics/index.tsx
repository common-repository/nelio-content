/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, Tooltip } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map, filter, toPairs } from 'lodash';
import { store as NC_DATA, usePost } from '@nelio-content/data';
import { getSupportedNetworks } from '@nelio-content/networks';
import type { Maybe, PostId, SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { SocialNetworkIcon } from '../social-network-icon';

export type PostEngagementAnalyticsProps = {
	readonly className?: string;
	readonly postId: PostId;
};

export const PostEngagementAnalytics = ( {
	className = '',
	postId,
}: PostEngagementAnalyticsProps ): JSX.Element => {
	const isSubscribed = useIsSubscribed();
	const engagement = useEngagement( postId );
	const metrics = useMetrics( postId );
	const comments = useComments( postId );

	return (
		<div className={ `nelio-content-engagement-analytics ${ className }` }>
			<div className="nelio-content-engagement-analytics__title">
				{ _x( 'Engagement', 'text', 'nelio-content' ) }
				<Tooltip
					text={ _x(
						'Number of interactions (likes, shares…) on social networks and comments in WordPress',
						'text',
						'nelio-content'
					) }
					placement="bottom"
				>
					<span className="nelio-content-engagement-analytics__help-icon">
						<Dashicon icon="editor-help" />
					</span>
				</Tooltip>
			</div>

			<div className="nelio-content-engagement-analytics__value">
				{ engagement }
			</div>

			<div className="nelio-content-engagement-analytics__metrics">
				{ map( metrics, ( [ network, metric ] ) => (
					<div
						key={ network }
						className="nelio-content-engagement-analytics__metric"
					>
						<SocialNetworkIcon
							className="nelio-content-engagement-analytics__metric-network"
							network={ network }
						/>
						<div className="nelio-content-engagement-analytics__metric-value">
							{ 'twitter' === network && ! isSubscribed
								? _x( 'N/A', 'text', 'nelio-content' )
								: metric }
						</div>
					</div>
				) ) }
				<div className="nelio-content-engagement-analytics__metric">
					<div className="nelio-content-engagement-analytics__metric-network nelio-content-engagement-analytics__metric-network--is-comments">
						<Dashicon icon="admin-comments" />
					</div>
					<div className="nelio-content-engagement-analytics__metric-value">
						{ comments }
					</div>
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsSubscribed = () =>
	useSelect( ( select ) => select( NC_DATA ).isSubscribed() );

const useEngagement = ( postId: PostId ) =>
	usePost( postId )?.statistics.engagement.total ?? '–';

const useComments = ( postId: PostId ) =>
	usePost( postId )?.statistics.engagement.comments || 0;

const useMetrics = ( postId: PostId ) => {
	const post = usePost( postId );
	const networks = getSupportedNetworks();
	const metrics = post?.statistics.engagement || {};
	const pairs = filter(
		toPairs( metrics ),
		< V, >(
			pair: [ 'total' | 'comments' | SocialNetworkName, Maybe< V > ]
		): pair is [ SocialNetworkName, V ] =>
			pair[ 0 ] !== 'total' &&
			pair[ 0 ] !== 'comments' &&
			pair[ 1 ] !== undefined
	);
	return filter( pairs, ( [ network ] ) => networks.includes( network ) );
};
