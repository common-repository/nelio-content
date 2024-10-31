/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/content-length', {
	icon: 'edit',
	interval: 2000,
	settings: {
		improvableThreshold: 700,
		goodThreshold: 1000,
	},
	attributes: ( select ) => {
		const { getContent } = select( NC_EDIT_POST );
		return {
			content: getContent(),
		};
	},
	validate: ( { content }, { improvableThreshold, goodThreshold } ) => {
		const wordCount = countWords( content );

		if ( wordCount < improvableThreshold ) {
			return {
				status: 'bad',
				text: _x( 'Write a longer copy', 'user', 'nelio-content' ),
			};
		} //end if

		if ( wordCount < goodThreshold ) {
			return {
				status: 'improvable',
				text: _x( 'Write a longer copy', 'user', 'nelio-content' ),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Copy length looks good', 'text', 'nelio-content' ),
		};
	},
} );

// =======
// HELPERS
// =======

function countWords( content = '' ) {
	content = content.replace( /<[^>]*>/g, '' );
	content = content.replace( /\s+/g, ' ' );
	return content.split( ' ' ).length;
} //end content()
