/**
 * WordPress dependencies
 */
import { sprintf, _nx, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { getLinks, isExternalUrl, isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/external-links', {
	icon: 'external',
	settings: {
		improvableThreshold: 1,
		goodThreshold: 2,
	},

	attributes: ( select ) => {
		const { getContent } = select( NC_EDIT_POST );
		return {
			content: getContent(),
		};
	},

	validate: ( { content }, settings ) => {
		const links = getLinks( content ).filter( isExternalUrl );
		const { improvableThreshold, goodThreshold } = settings;
		const numOfMissingLinks = goodThreshold - links.length;

		if ( isEmpty( links ) ) {
			return {
				status:
					links.length < improvableThreshold ? 'bad' : 'improvable',
				text: sprintf(
					/* translators: number of links */
					_nx(
						'Add %d link to an external source',
						'Add %d links to external sources',
						numOfMissingLinks,
						'user',
						'nelio-content'
					),
					numOfMissingLinks
				),
			};
		} //end if

		if ( links.length < goodThreshold ) {
			return {
				status:
					links.length < improvableThreshold ? 'bad' : 'improvable',
				text: sprintf(
					/* translators: number of links */
					_nx(
						'Add %d more link to an external source',
						'Add %d more links to external sources',
						numOfMissingLinks,
						'user',
						'nelio-content'
					),
					numOfMissingLinks
				),
			};
		} //end if

		return {
			status: 'good',
			text: _x(
				'Links to external sources look good',
				'text',
				'nelio-content'
			),
		};
	},
} );
