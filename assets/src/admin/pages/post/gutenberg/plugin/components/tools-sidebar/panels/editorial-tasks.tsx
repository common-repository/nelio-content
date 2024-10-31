/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PremiumPlaceholderPanel } from '@nelio-content/components';
import { useIsSubscribed } from '@nelio-content/data';
import { EditorialTasks, usePanelToggling } from '@nelio-content/edit-post';

/**
 * Internal dependencies
 */
import { useIsFeatureEnabled } from '~/nelio-content-pages/post/gutenberg/plugin/hooks';

export const EditorialTasksPanel = (): JSX.Element | null => {
	const isSubscribed = useIsSubscribed();
	const [ isPanelOpen, togglePanel ] = usePanelToggling( 'tasks' );

	if ( ! useIsFeatureEnabled( 'tasks' ) ) {
		return null;
	} //end if

	if ( ! isSubscribed ) {
		return (
			<PremiumPlaceholderPanel
				title={ _x( 'Editorial Tasks', 'text', 'nelio-content' ) }
				feature="raw/editorial-tasks"
			/>
		);
	} //end if

	return (
		<PanelBody
			initialOpen={ isPanelOpen }
			opened={ isPanelOpen }
			onToggle={ togglePanel }
			title={ _x( 'Editorial Tasks', 'text', 'nelio-content' ) }
		>
			<EditorialTasks />
		</PanelBody>
	);
};
