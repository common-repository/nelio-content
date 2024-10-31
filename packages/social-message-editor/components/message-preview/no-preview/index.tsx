/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, ExternalLink } from '@safe-wordpress/components';
import { _x, __ } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * Internal dependencies
 */
import './style.scss';

export const NoPreview = (): JSX.Element => (
	<div className="nelio-content-no-preview-in-social-editor ">
		<div className="nelio-content-no-preview-in-social-editor__title">
			<Dashicon
				className="nelio-content-no-preview-in-social-editor__icon"
				icon="warning"
			/>
			{ _x( 'Preview not available', 'text', 'nelio-content' ) }
		</div>

		<div className="nelio-content-no-preview-in-social-editor__explanation">
			{ _x(
				'Please select a social profile using the selector above.',
				'user',
				'nelio-content'
			) }
		</div>

		<div className="nelio-content-no-preview-in-social-editor__action">
			<ExternalLink
				href={ addQueryArgs(
					'https://neliosoftware.com/content/help/how-to-select-social-profiles/',
					{
						utm_source: 'nelio-content',
						utm_medium: 'plugin',
						utm_campaign: 'support',
						utm_content: 'social-message-editor',
					}
				) }
			>
				{ _x( 'Show me how…', 'command', 'nelio-content' ) }
			</ExternalLink>
		</div>
	</div>
);
