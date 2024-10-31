/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { compose } from '@safe-wordpress/compose';

/**
 * External dependencies
 */
import { withSubscriptionCheck } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { Progress } from './progress';
import { Tasks } from './tasks';
import { TaskCreator } from './task-creator';
import { TaskPresets } from './task-presets';

import { withLoadingCheck, withPostReadyCheck } from '../safe-guards';

const InternalEditorialTasks = () => (
	<>
		<Progress />
		<Tasks />
		<TaskCreator />
		<TaskPresets />
	</>
);

export const EditorialTasks = compose(
	( c: typeof InternalEditorialTasks ) =>
		withSubscriptionCheck( 'raw/editorial-tasks', c ),
	withPostReadyCheck,
	withLoadingCheck( 'isRetrievingEditorialTasks' )
)( InternalEditorialTasks ) as typeof InternalEditorialTasks;
