/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Toolbar, ToolbarButton } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

export type Tab = 'publication' | 'reshare';

export type TabSelectorProps = {
	readonly className?: string;
	readonly tab: Tab;
	readonly setTab: ( tab: Tab ) => void;
};

export const TabSelector = ( {
	className,
	tab,
	setTab,
}: TabSelectorProps ): JSX.Element => (
	<Toolbar
		className={ className }
		label={ _x( 'Settings', 'text', 'nelio-content' ) }
	>
		<ToolbarButton
			icon="megaphone"
			title={ _x( 'Publication', 'text', 'nelio-content' ) }
			isActive={ tab === 'publication' }
			onClick={ () => setTab( 'publication' ) }
		/>
		<ToolbarButton
			icon="share-alt"
			title={ _x( 'Reshare', 'text', 'nelio-content' ) }
			isActive={ tab === 'reshare' }
			onClick={ () => setTab( 'reshare' ) }
		/>
	</Toolbar>
);
