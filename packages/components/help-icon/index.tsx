/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, Tooltip } from '@safe-wordpress/components';

export type HelpIconProps = {
	readonly className?: string;
	readonly type?: 'info' | 'editor-help';
	readonly text?: string;
};

export const HelpIcon = ( {
	type,
	text,
	className,
}: HelpIconProps ): JSX.Element => (
	<Tooltip text={ text }>
		<span className={ className }>
			<Dashicon icon={ 'info' === type ? 'info' : 'editor-help' } />
		</span>
	</Tooltip>
);
