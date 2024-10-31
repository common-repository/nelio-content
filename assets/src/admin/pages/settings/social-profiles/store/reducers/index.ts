/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { connection } from './connection';
import { profileEditor } from './profile-editor';
import { profileList } from './profile-list';

export default combineReducers( {
	connection,
	profileEditor,
	profileList,
} );
