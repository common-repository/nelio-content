/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';
import type { Maybe, PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/editorial-tasks', {
	icon: 'flag',
	settings: {
		useBadStatus: true,
	},
	attributes: ( select ) => {
		const { getPostId, getPostType: type } = select( NC_EDIT_POST );
		const { getPostTypes, getTasksRelatedToPost } = select( NC_DATA );
		return {
			isEnabled: getPostTypes( 'tasks' )
				.map( ( x ): Maybe< PostTypeName > => x.name )
				.includes( type() ),
			tasks: getTasksRelatedToPost( getPostId() ),
		};
	},
	validate: ( { isEnabled, tasks }, { useBadStatus } ) => {
		if ( ! isEnabled ) {
			return { status: 'invisible', text: '' };
		} //end if

		const incompletedTasks = tasks.filter( ( task ) => ! task.completed );

		if ( ! isEmpty( incompletedTasks ) ) {
			return {
				status: useBadStatus ? 'bad' : 'improvable',
				text: _x( 'Complete all tasks', 'user', 'nelio-content' ),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'There are no pending tasks', 'text', 'nelio-content' ),
		};
	},
} );
