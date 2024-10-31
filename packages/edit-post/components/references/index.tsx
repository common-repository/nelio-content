/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Links } from './links';
import { ReferenceCreator } from './reference-creator';

export const References = (): JSX.Element => {
	return (
		<>
			<Links />
			<ReferenceCreator />
		</>
	);
};
