/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import type { Attrs, PostAnalyticsResponse, SetAttrs } from './config';

export function openGAProfileSelector( {
	onOpen = () => void null,
	onClose = () => void null,
}: {
	readonly onOpen?: () => void;
	readonly onClose?: () => void;
} ): void {
	onOpen();

	const siteId = select( NC_DATA ).getSiteId();
	const redirect = select( NC_DATA ).getRestUrl(
		'/nelio-content/v1/analytics/connect'
	);
	const apiRoot = select( NC_DATA ).getApiRoot();
	const dialog = window.open(
		addQueryArgs( `${ apiRoot }/connect/ga`, {
			siteId,
			redirect,
		} ),
		'',
		'width=640,height=480'
	);

	const timer = setInterval( () => {
		if ( ! dialog?.closed ) {
			return;
		} //end if
		clearInterval( timer );
		onClose();
	}, 500 );
} //end openProfileSelector()

export function validateCode( code: string, setAttributes: SetAttrs ): void {
	setAttributes( { isValidating: true, refreshDisabled: true } );

	void apiFetch( {
		path: '/nelio-content/v1/analytics/refresh-access-token',
		method: 'PUT',
		data: { code },
	} ).then( () =>
		setAttributes( {
			mode: 'ga4-property-id',
			isValidating: false,
			refreshDisabled: true,
		} )
	);
} //end validateCode()

export function refreshAnalytics(
	period: Attrs[ 'refreshPeriod' ],
	setAttributes: SetAttrs
): void {
	setAttributes( {
		error: false,
		isRefreshing: true,
		isStartingRefresh: true,
		isRefreshingOver: false,
		refreshPostCount: 0,
		refreshPostIndex: 0,
	} );
	refreshAnalyticsPaginated( period, 1, setAttributes );
} //end refreshAnalytics()

// =======
// HELPERS
// =======

function refreshAnalyticsPaginated(
	period: Attrs[ 'refreshPeriod' ],
	page: number,
	setAttributes: SetAttrs
): void {
	if ( page < 1 ) {
		endAnalyticsRefresh( 0, setAttributes );
		return;
	} //end if

	void apiFetch< PostAnalyticsResponse >( {
		path: addQueryArgs( '/nelio-content/v1/analytics/post', {
			period,
			page,
		} ),
	} ).then( ( { ids, more, total, ppp: postsPerPage } ) => {
		if ( isEmpty( ids ) ) {
			endAnalyticsRefresh( total, setAttributes );
			return;
		} //end if

		let refreshPostIndex = postsPerPage * ( page - 1 );

		setAttributes( {
			isStartingRefresh: false,
			refreshPostCount: total,
			refreshPostIndex: Math.min( total, refreshPostIndex ),
		} );

		const promises = map( ids, ( id ) =>
			apiFetch( {
				path: `/nelio-content/v1/analytics/post/${ id }/update`,
				method: 'PUT',
			} ).then( () => {
				++refreshPostIndex;
				setAttributes( {
					refreshPostIndex: Math.min( total, refreshPostIndex ),
				} );
			} )
		);

		void Promise.all( promises )
			.then( () =>
				more
					? refreshAnalyticsPaginated(
							period,
							page + 1,
							setAttributes
					  )
					: endAnalyticsRefresh( total, setAttributes )
			)
			.catch( ( e ) => {
				const error = getMessage( e );
				setAttributes( {
					error,
					isRefreshing: false,
					isStartingRefresh: false,
					isRefreshingOver: true,
					refreshPostCount: 0,
				} );
			} );
	} );
} //end refreshAnalyticsPaginated()

function endAnalyticsRefresh(
	totalPostCount: number,
	setAttributes: SetAttrs
): void {
	setAttributes( {
		isRefreshing: false,
		isStartingRefresh: false,
		isRefreshingOver: true,
		refreshPostCount: totalPostCount,
		refreshPostIndex: totalPostCount,
	} );
} //end endAnalyticsRefresh()

function getMessage( e: unknown ): string {
	const defaultMessage = `${ _x(
		'Unknown Error',
		'text',
		'nelio-content'
	) }. ${ _x( 'Unable to refresh analytics.', 'text', 'nelio-content' ) }`;
	return !! e &&
		'object' === typeof e &&
		'message' in e &&
		'string' === typeof e.message
		? e.message || defaultMessage
		: defaultMessage;
}
