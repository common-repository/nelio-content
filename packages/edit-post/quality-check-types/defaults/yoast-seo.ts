/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Dict, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';

registerQualityCheck( 'nelio-content/yoast-seo', {
	icon: 'book',
	attributes: ( select ) => {
		const isEnabled = !! select( 'yoast-seo/editor' );
		if ( ! isEnabled ) {
			return {
				status: 'invisible' as const,
				text: '',
			};
		} //end if

		try {
			const { getFocusKeyphrase } = select( 'yoast-seo/editor' );
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			if ( ! getFocusKeyphrase?.() ) {
				return {
					status: 'unknown' as const,
					text: _x(
						'Yoast SEO score is not available',
						'text',
						'nelio-content'
					),
				};
			} //end if

			const { getResultsForFocusKeyword } = select( 'yoast-seo/editor' );
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const results: Maybe< Dict< number > > =
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				getResultsForFocusKeyword?.();
			const score = results?.overallScore ?? 0;

			if ( score < 40 ) {
				return {
					status: 'bad' as const,
					text: _x(
						'Address your Yoast SEO score',
						'user',
						'nelio-content'
					),
				};
			} //end if

			if ( score < 70 ) {
				return {
					status: 'improvable' as const,
					text: _x(
						'Improve Yoast SEO score',
						'user',
						'nelio-content'
					),
				};
			} //end if

			return {
				status: 'good' as const,
				text: _x( 'Yoast SEO looks good', 'user', 'nelio-content' ),
			};
		} catch ( _ ) {
			return {
				status: 'unknown' as const,
				text: _x(
					'Unable to retrieve Yoast SEO score',
					'text',
					'nelio-content'
				),
			};
		} //end catch
	},
	validate: ( attrs ) => attrs,
} );
