/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';

export const TweetAction = (): JSX.Element => (
	<ExternalLink
		className="components-button is-primary"
		href={ addQueryArgs( 'https://twitter.com/intent/tweet', {
			text: _x(
				'Nelio Content is an awesome #EditorialCalendar for #WordPress by @NelioSoft!',
				'text',
				'nelio-content'
			),
		} ) }
	>
		{ _x( 'Tweet About Nelio Content', 'command', 'nelio-content' ) }
	</ExternalLink>
);
