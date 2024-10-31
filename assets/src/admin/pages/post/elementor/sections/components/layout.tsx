/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { SocialMediaSidebar, ReferenceEditor } from '@nelio-content/edit-post';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';
import { TaskEditor } from '@nelio-content/task-editor';

/**
 * Internal dependencies
 */
import { ToolsSidebar } from './tools-sidebar';
import './style.scss';

export const Layout = (): JSX.Element => {
	const [ activeTab, setActiveTab ] = useState( 'tools' );
	return (
		<>
			<TabPanel
				className="nelio-content-elementor-editor__tab-panel"
				activeClass="nelio-content-elementor-editor__tab--is-active"
				orientation="horizontal"
				initialTabName={ activeTab }
				onSelect={ setActiveTab }
				tabs={ [
					{
						name: 'tools',
						title: _x( 'Editorial Tools', 'text', 'nelio-content' ),
						className: 'nelio-content-elementor-editor__tab',
					},
					{
						name: 'social',
						title: _x( 'Social Media', 'text', 'nelio-content' ),
						className: 'nelio-content-elementor-editor__tab',
					},
				] }
			>
				{ ( { name: tab } ) => (
					<>
						{ 'tools' === tab && <ToolsSidebar /> }
						{ 'social' === tab && <SocialMediaSidebar /> }
					</>
				) }
			</TabPanel>

			<ReferenceEditor />
			<SocialMessageEditor />
			<TaskEditor />
		</>
	);
};
