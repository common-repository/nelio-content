/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal, Spinner } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isArray, toPairs } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { ContextualHelp } from '@nelio-content/components';
import { isDefined } from '@nelio-content/utils';
import type { PostTypeContext } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_POST_EDITOR } from './store';
import { walkthrough } from './walkthrough';

import { ErrorDetector } from './components/error-detector';
import { EditWarning } from './components/edit-warning';
import { Actions } from './components/actions';

import { Author } from './components/author';
import { DateSelector } from './components/date-selector';
import { ExtraInformation } from './components/extra-information';
import { PostTitle } from './components/post-title';
import { TimeSelector } from './components/time-selector';
import { TypeSelector } from './components/type-selector';
import { StatusSelector } from './components/status-selector';

export * from './store';
export * from './premium';

export type PostQuickEditorProps = {
	readonly className?: string;
	readonly context:
		| PostTypeContext
		| [ PostTypeContext, ...PostTypeContext[] ];
};

export const PostQuickEditor = ( {
	className = '',
	context,
}: PostQuickEditorProps ): JSX.Element | null => {
	const visible = useIsVisible();
	const isLoading = useIsLoading();
	const header = <Header />;

	const contexts: [ PostTypeContext, ...PostTypeContext[] ] = isArray(
		context
	)
		? context
		: [ context ];

	if ( ! visible ) {
		return null;
	} //end if

	if ( isLoading ) {
		return (
			<Modal
				className={ `nelio-content-post-quick-editor ${ className }` }
				title={ _x( 'Loading…', 'text', 'nelio-content' ) }
				isDismissible={ false }
				shouldCloseOnEsc={ false }
				shouldCloseOnClickOutside={ false }
				onRequestClose={ () => void null }
			>
				<div style={ { display: 'flex', justifyContent: 'center' } }>
					<Spinner />
				</div>
			</Modal>
		);
	} //end if

	return (
		<Modal
			className={ `nelio-content-post-quick-editor ${ className }` }
			title={ header as unknown as string }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<div className="nelio-content-post-quick-editor__title-type-and-status">
				<PostTitle />
				<TypeSelector contexts={ contexts } />
				<StatusSelector />
			</div>

			<div className="nelio-content-post-quick-editor__author-and-datetime">
				<Author />
				<DateSelector />
				<TimeSelector />
			</div>

			<ExtraInformation />

			<ErrorDetector />
			<EditWarning />
			<Actions />
		</Modal>
	);
};

const Header = (): JSX.Element => {
	const title = useModalTitle();
	return (
		<div className="nelio-content-post-quick-editor__header">
			<div className="nelio-content-post-quick-editor__header-text">
				{ title }
			</div>
			<div className="nelio-content-post-quick-editor__header-help">
				<ContextualHelp
					context="post-quick-editor"
					walkthrough={ walkthrough }
					autostart={ true }
				/>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsVisible = () =>
	useSelect( ( select ) => select( NC_POST_EDITOR ).isVisible() );

const useModalTitle = () =>
	useSelect( ( select ) => {
		select( NC_DATA );
		select( NC_POST_EDITOR );
		const isNew = select( NC_POST_EDITOR ).isNewPost();
		const typeName = select( NC_POST_EDITOR ).getPostType();
		const type = typeName && select( NC_DATA ).getPostType( typeName );
		if ( ! type ) {
			return isNew
				? _x( 'New post', 'text', 'nelio-content' )
				: _x( 'Edit post', 'text', 'nelio-content' );
		} //end if
		return isNew ? type.labels.new : type.labels.edit;
	} );

const useIsLoading = () => {
	const isNew = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).isNewPost()
	);
	const isLoadingTasks = useTaskLoaderEffect();
	const isLoadingPremiumItems = usePremiumItemsLoaderEffect();
	const isLoadingRefs = useReferenceLoaderEffect();
	const isLoading = isLoadingTasks || isLoadingPremiumItems || isLoadingRefs;
	return ! isNew && isLoading;
};

const useReferenceLoaderEffect = () => {
	const { setReferences } = useDispatch( NC_POST_EDITOR );
	const { references, isLoading, isVisible } = useSelect( ( select ) => {
		const postId = select( NC_POST_EDITOR ).getId();
		return {
			references: select( NC_DATA ).getSuggestedReferences( postId ),
			isLoading:
				! select( NC_DATA ).hasFinishedResolution(
					'getSuggestedReferences',
					[ postId ]
				) &&
				! select( NC_DATA ).hasResolutionFailed(
					'getSuggestedReferences',
					[ postId ]
				),
			isVisible: select( NC_POST_EDITOR ).isVisible(),
		};
	} );

	useEffect( () => {
		if ( ! isVisible || isLoading ) {
			return;
		} //end if
		void setReferences( references );
	}, [ isVisible, setReferences, JSON.stringify( references ), isLoading ] );

	return isLoading;
};

const useTaskLoaderEffect = () => {
	const { setTasks } = useDispatch( NC_POST_EDITOR );
	const { tasks, isLoading, isVisible } = useSelect( ( select ) => {
		const postId = select( NC_POST_EDITOR ).getId();
		return {
			tasks: select( NC_DATA ).getTasksRelatedToPost( postId ),
			isLoading:
				! select( NC_DATA ).hasFinishedResolution(
					'getTasksRelatedToPost',
					[ postId ]
				) &&
				! select( NC_DATA ).hasResolutionFailed(
					'getTasksRelatedToPost',
					[ postId ]
				),
			isVisible: select( NC_POST_EDITOR ).isVisible(),
		};
	} );

	useEffect( () => {
		if ( ! isVisible || isLoading ) {
			return;
		} //end if
		void setTasks( tasks );
	}, [ isVisible, setTasks, JSON.stringify( tasks ), isLoading ] );

	return isLoading;
};

const usePremiumItemsLoaderEffect = () => {
	const { setPremiumItems } = useDispatch( NC_POST_EDITOR );
	const { premiumItems, isLoading, isVisible } = useSelect( ( select ) => {
		const postId = select( NC_POST_EDITOR ).getId();
		return {
			premiumItems:
				select( NC_DATA ).getAllPremiumItemsRelatedToPost( postId ),
			isLoading:
				! select( NC_DATA ).hasFinishedResolution(
					'getAllPremiumItemsRelatedToPost',
					[ postId ]
				) &&
				! select( NC_DATA ).hasResolutionFailed(
					'getAllPremiumItemsRelatedToPost',
					[ postId ]
				),
			isVisible: select( NC_POST_EDITOR ).isVisible(),
		};
	} );

	useEffect( () => {
		if ( ! isVisible || isLoading ) {
			return;
		} //end if
		toPairs( premiumItems )
			.map( ( [ type, items ] ) =>
				items ? ( [ type, items ] as const ) : undefined
			)
			.filter( isDefined )
			.forEach( ( [ type, items ] ) => setPremiumItems( type, items ) );
	}, [
		isVisible,
		setPremiumItems,
		JSON.stringify( premiumItems ),
		isLoading,
	] );

	return isLoading;
};
