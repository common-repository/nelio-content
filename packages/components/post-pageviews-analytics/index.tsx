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
import { store as NC_DATA } from '@nelio-content/data';
import type { PostId, SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { SocialNetworkIcon } from '../social-network-icon';

export type PostPageviewsAnalyticsProps = {
	readonly className?: string;
	readonly postId: PostId;
};

export const PostPageviewsAnalytics = ( {
	className = '',
	postId,
}: PostPageviewsAnalyticsProps ): JSX.Element | null => {
	const isVisible = useIsVisible();
	const pageviews = usePageViews( postId );
	const metrics = useMetrics();

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<div className={ `nelio-content-pageviews-analytics ${ className }` }>
			<div className="nelio-content-pageviews-analytics__title">
				{ _x( 'Pageviews', 'text', 'nelio-content' ) }
				<Tooltip
					text={ _x(
						'Total pageviews according to Google Analytics',
						'text',
						'nelio-content'
					) }
					placement="bottom"
				>
					<span className="nelio-content-pageviews-analytics__help-icon">
						<Dashicon icon="editor-help" />
					</span>
				</Tooltip>
			</div>

			<div className="nelio-content-pageviews-analytics__value">
				{ pageviews }
			</div>

			<div className="nelio-content-pageviews-analytics__metrics">
				{ metrics.map( ( [ network, metric ] ) => (
					<div
						key={ network }
						className="nelio-content-pageviews-analytics__metric"
					>
						<SocialNetworkIcon
							className="nelio-content-pageviews-analytics__metric-network"
							network={ network }
						/>
						<div className="nelio-content-pageviews-analytics__metric-value">
							{ metric }
						</div>
					</div>
				) ) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsVisible = () =>
	useSelect( ( select ) => select( NC_DATA ).isGAConnected() );

const usePageViews = ( postId: PostId ) =>
	useSelect(
		( select ) =>
			select( NC_DATA ).getPost( postId )?.statistics.pageviews ?? '–'
	);

const useMetrics = (): ReadonlyArray< [ SocialNetworkName, string ] > => [
	[ 'twitter', '–' ],
	[ 'facebook', '–' ],
	[ 'linkedin', '–' ],
	[ 'instagram', '–' ],
	[ 'pinterest', '–' ],
	[ 'tumblr', '–' ],
];
