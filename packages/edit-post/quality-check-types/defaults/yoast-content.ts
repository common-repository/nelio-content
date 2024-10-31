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

registerQualityCheck( 'nelio-content/yoast-content', {
	icon: 'chart-bar',
	attributes: ( select ) => {
		const isEnabled = !! select( 'yoast-seo/editor' );
		if ( ! isEnabled ) {
			return {
				status: 'invisible' as const,
				text: '',
			};
		} //end if

		try {
			const { getReadabilityResults } = select( 'yoast-seo/editor' );
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const results: Maybe< Dict< number > > = getReadabilityResults?.();
			const score = results?.overallScore ?? 0;

			if ( score < 40 ) {
				return {
					status: 'bad' as const,
					text: _x(
						'According to Yoast, content needs improvement',
						'text',
						'nelio-content'
					),
				};
			} //end if

			if ( score < 70 ) {
				return {
					status: 'improvable' as const,
					text: _x(
						'According to Yoast, content is OK',
						'text',
						'nelio-content'
					),
				};
			} //end if

			return {
				status: 'good' as const,
				text: _x(
					'According to Yoast, content is good',
					'text',
					'nelio-content'
				),
			};
		} catch ( _ ) {
			return {
				status: 'unknown' as const,
				text: _x(
					'Unable to retrieve Yoast Content Analysis',
					'text',
					'nelio-content'
				),
			};
		} //end catch
	},
	validate: ( attrs ) => attrs,
} );
