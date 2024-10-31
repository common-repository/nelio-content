/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { comments } from './comments';
import { externalFeaturedImage } from './external-featured-image';
import { post } from './post';
import { postQuality } from './post-quality';
import { premiumByType } from './premium';
import { qualityCheckTypes } from './quality-check-types';
import { references } from './references';
import { settings } from './settings';
import { social } from './social';
import { tasks } from './tasks';

export default combineReducers( {
	comments,
	externalFeaturedImage,
	post,
	postQuality,
	premiumByType,
	qualityCheckTypes,
	references,
	settings,
	social,
	tasks,
} );
