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
import { Input } from './input';
import { Comments } from './comments';

import { withLoadingCheck, withPostReadyCheck } from '../safe-guards';

const InternalEditorialComments = () => (
	<>
		<Comments />
		<Input />
	</>
);

export const EditorialComments = compose(
	( c: typeof InternalEditorialComments ) =>
		withSubscriptionCheck( 'raw/editorial-comments', c ),
	withPostReadyCheck,
	withLoadingCheck( 'isRetrievingEditorialComments' )
)( InternalEditorialComments ) as typeof InternalEditorialComments;
