/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as authors } from './authors/reducer';
import { reducer as comments } from './comments/reducer';
import { reducer as externalEvents } from './external-events/reducer';
import { reducer as feeds } from './feeds/reducer';
import { reducer as internalEvents } from './internal-events/reducer';
import { reducer as medias } from './medias/reducer';
import { reducer as messages } from './messages/reducer';
import { reducer as posts } from './posts/reducer';
import { reducer as premiumByType } from './premium/reducer';
import { reducer as references } from './references/reducer';
import { reducer as reusableMessages } from './reusable-messages/reducer';
import { reducer as sharedLinks } from './shared-links/reducer';
import { reducer as tasks } from './tasks/reducer';
import { reducer as taskPresets } from './task-presets/reducer';

export const reducer = combineReducers( {
	authors,
	comments,
	externalEvents,
	feeds,
	internalEvents,
	medias,
	messages,
	posts,
	premiumByType,
	references,
	reusableMessages,
	sharedLinks,
	tasks,
	taskPresets,
} );
