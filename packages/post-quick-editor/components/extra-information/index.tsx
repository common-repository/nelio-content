/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { getPremiumComponent } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { Comments } from './comments';
import { SuggestedReferences } from './suggested-references';
import { Tasks } from './tasks';
import { Taxonomies } from './taxonomies';

import {
	useIsFeatureEnabled,
	useMayHaveExtraInfo,
	useSupportsTaxonomies,
} from '../../hooks';
import { store as NC_POST_EDITOR } from '../../store';
import type { ExtraInfoTab } from '../../store/types';

export const ExtraInformation = (): JSX.Element | null => {
	const activeTab = useActiveTab();

	if ( ! useMayHaveExtraInfo() ) {
		return null;
	} //end if

	return 'none' === activeTab ? null : <TabbedInfo tab={ activeTab } />;
};

// ======
// HELPER
// ======

const TabbedInfo = ( { tab }: { tab: TabType } ) => {
	const TabComponent = useTabComponent( tab );
	const tabs = useTabs();
	const { setExtraInfoTab } = useDispatch( NC_POST_EDITOR );

	return (
		<div className="nelio-content-pqe-extra">
			<div className="nelio-content-pqe-extra__tabs">
				{ tabs.map( ( { name, title } ) => (
					<button
						key={ name }
						title={ title }
						className={ classnames(
							'nelio-content-pqe-extra__tab',
							{
								'nelio-content-pqe-extra__tab--active':
									tab === name,
							}
						) }
						onClick={ () => setExtraInfoTab( name ) }
					>
						{ title }
					</button>
				) ) }
			</div>
			<div className="nelio-content-pqe-extra__content">
				<TabComponent />
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTabComponent = ( tab: TabType ): ( () => JSX.Element | null ) => {
	switch ( tab ) {
		case 'tasks':
			return Tasks;

		case 'future-actions':
			return getPremiumComponent(
				'pqe/future-actions',
				'raw/future-actions'
			);

		case 'comments':
			return Comments;

		case 'references':
			return SuggestedReferences;

		case 'taxonomies':
			return () => <Taxonomies showLabels />;
	} //end switch
};

const useActiveTab = () =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).getExtraInfoTab() );

const useTabs = (): ReadonlyArray< Tab > =>
	[
		useSupportsTaxonomies() && {
			name: 'taxonomies' as const,
			title: _x( 'Taxonomies', 'text', 'nelio-content' ),
		},
		useIsFeatureEnabled( 'tasks' ) && {
			name: 'tasks' as const,
			title: _x( 'Tasks', 'text', 'nelio-content' ),
		},
		useIsFeatureEnabled( 'future-actions' ) && {
			name: 'future-actions' as const,
			title: _x( 'Future Actions', 'text', 'nelio-content' ),
		},
		useIsFeatureEnabled( 'comments' ) && {
			name: 'comments' as const,
			title: _x( 'Comments', 'text', 'nelio-content' ),
		},
		useIsFeatureEnabled( 'references' ) && {
			name: 'references' as const,
			title: _x( 'References', 'text', 'nelio-content' ),
		},
	].filter( ( x ) => !! x );

// ============
// HELPER TYPES
// ============

type TabType = Exclude< ExtraInfoTab, 'none' >;

type Tab = {
	readonly name: TabType;
	readonly title: string;
};
