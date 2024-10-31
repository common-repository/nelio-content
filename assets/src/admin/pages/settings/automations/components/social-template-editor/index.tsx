/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	Modal,
	TextareaControl,
	Toolbar,
	ToolbarButton,
	SelectControl,
	Spinner,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { keys, map, pick, values } from 'lodash';
import {
	ItemSelectControl,
	ContextualHelp,
	SaveButton,
} from '@nelio-content/components';
import { usePostTypes } from '@nelio-content/data';
import {
	doesNetworkSupport,
	getNetworkIcon,
	getNetworkLabel,
} from '@nelio-content/networks';
import { isDefined, isUniversalGroup } from '@nelio-content/utils';

import type {
	AutomationGroupId,
	Maybe,
	PostType,
	SocialTemplate,
	TaxonomySlug,
	TermId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { AvailabilityControl } from './availability-control';
import { walkthrough } from './walkthrough';
import { PlaceholderInserter } from './placeholder-inserter';
import { TargetSelector } from './target-selector';

import {
	useAutomationGroup,
	useEntityRecordLoader,
	useSupportsAuthor,
	useTaxonomies,
	useTemplateErrors,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export type SocialTemplateEditorProps = {
	readonly className?: string;
};

export const SocialTemplateEditor = ( {
	className = '',
}: SocialTemplateEditorProps ): JSX.Element | null => {
	const isOpen = useIsOpen();
	const [ areDetailsVisible, showDetails ] = useDetails();
	const [ tab, setTab ] = useState< Tab >( 'availability' );

	const [ attributes, setAttributes ] = useAttributes();
	const { isNewTemplate, templateType } = useAdditionalAttributes();
	const groupPostTypes = useGroupPostTypes( attributes?.groupId );
	const areAuthorsSupported = useSupportsAuthor( attributes?.postType );

	const [ isNetworkTemplate, setNetworkTemplate ] =
		useEditingNetworkTemplate();

	const { closeTemplateEditor, receiveAutomationGroupTemplates } =
		useDispatch( NC_AUTOMATION_SETTINGS );

	const error = useSaveError();
	useValidationEffect();

	const taxonomies = useTaxonomies( attributes?.postType );

	useEffect( () => {
		if ( groupPostTypes.length > 1 ) {
			setTab( 'postType' );
		} else if ( taxonomies.length ) {
			setTab( 'taxonomy' );
		} else if ( areAuthorsSupported ) {
			setTab( 'author' );
		} else {
			setTab( 'availability' );
		} //end if
	}, [ groupPostTypes.length, attributes?.postType ] );

	if ( ! isOpen || ! attributes || ! taxonomies ) {
		return null;
	} //end if

	const close = () => {
		void closeTemplateEditor();
		showDetails( false );
	};

	const saveTemplate = () => {
		close();
		void receiveAutomationGroupTemplates( templateType, {
			...attributes,
			taxonomies: pick(
				attributes.taxonomies,
				map( taxonomies, 'slug' ) as TaxonomySlug[]
			),
			profileId: isNetworkTemplate ? undefined : attributes.profileId,
			targetName: isNetworkTemplate ? undefined : attributes.targetName,
		} );
	};

	const { text, network } = attributes;

	const setText = ( value: string ) => setAttributes( { text: value } );
	const appendTag = ( tag: string ) =>
		setText(
			/[^\s]$/.test( text ) ? `${ text } ${ tag }` : `${ text }${ tag }`
		);

	return (
		<Modal
			className={ `nelio-content-social-template-editor-dialog ${ className }` }
			title={
				isNetworkTemplate
					? getNetworkTitle( isNewTemplate )
					: getTitle( isNewTemplate )
			}
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<TargetSelector
				network={ attributes.network }
				profileId={ attributes.profileId }
				targetName={ attributes.targetName }
				onTargetChange={ ( targetName ) =>
					setAttributes( { targetName } )
				}
			/>
			<TextareaControl
				className="nelio-content-social-template-editor-dialog__text"
				value={ text }
				onChange={ setText }
				placeholder={ _x(
					'Write a template…',
					'user',
					'nelio-content'
				) }
			/>

			<div className="nelio-content-social-template-editor-dialog__quick-actions">
				{ ! areDetailsVisible ? (
					<Button
						variant="link"
						onClick={ () => showDetails( true ) }
					>
						{ _x(
							'Additional options',
							'command',
							'nelio-content'
						) }
					</Button>
				) : (
					<TabSelector
						className="nelio-content-social-template-editor-dialog__tab-selector"
						tab={ tab }
						availableTabs={ [
							groupPostTypes.length > 1 && 'postType',
							!! taxonomies.length && 'taxonomy',
							areAuthorsSupported && 'author',
							'availability',
							'attachment',
						] }
						setTab={ setTab }
					/>
				) }
				<div className="nelio-content-social-template-editor-dialog__quick-action-spacer" />
				{ isNewTemplate &&
					doesNetworkSupport( 'network-template', network ) &&
					! doesNetworkSupport( 'multi-target', network ) && (
						<Button
							className={ classnames( {
								'nelio-content-social-template-editor-dialog__quick-action':
									true,
								'nelio-content-social-template-editor-dialog__quick-action--is-preview':
									true,
								'nelio-content-social-template-editor-dialog__quick-action--is-toggled':
									isNetworkTemplate,
							} ) }
							icon={ getNetworkIcon( network ) }
							label={ sprintf(
								/* translators: network name */
								_x(
									'Network template (available to all %s profiles)',
									'text',
									'nelio-content'
								),
								getNetworkLabel( 'name', network )
							) }
							onClick={ () =>
								setNetworkTemplate( ! isNetworkTemplate )
							}
						/>
					) }
				<PlaceholderInserter onClick={ ( tag ) => appendTag( tag ) } />
			</div>

			{ areDetailsVisible && <Details type={ tab } /> }

			<div className="nelio-content-social-template-editor-dialog__buttons">
				<ContextualHelp
					context="social-template-editor"
					walkthrough={ walkthrough }
					autostart={ true }
				/>

				<div className="nelio-content-social-template-editor-dialog__default-buttons-wrapper">
					<Button
						className="nelio-content-social-template-editor-dialog__cancel-button"
						variant="secondary"
						onClick={ close }
					>
						{ _x( 'Cancel', 'command', 'nelio-content' ) }
					</Button>

					<SaveButton
						className="nelio-content-social-template-editor-dialog__save-button"
						variant="primary"
						isUpdate={ ! isNewTemplate }
						error={ error }
						onClick={ saveTemplate }
					/>
				</div>
			</div>
		</Modal>
	);
};

// ============
// HELPER VIEWS
// ============

type DetailsProps = {
	readonly type: Tab;
};

const Details = ( { type }: DetailsProps ): JSX.Element | null => {
	const [ attributes, setAttributes ] = useAttributes();
	const postTypes = usePostTypes( 'social' );
	const taxonomies = useTaxonomies( attributes?.postType );
	const isReady = useEntityRecordLoader( attributes?.postType );

	const templateErrors = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplateErrors()
	);

	const attachmentExplanation = useAttachmentExplanation(
		attributes?.attachment
	);

	if ( ! attributes || ! templateErrors ) {
		return null;
	} //end if

	const { author } = attributes;

	if ( ! isReady ) {
		return (
			<div className="nelio-content-social-template-editor-dialog__extra">
				<Spinner />
			</div>
		);
	} //end if

	switch ( type ) {
		case 'postType':
			return (
				<div className="nelio-content-social-template-editor-dialog__extra">
					<SelectControl
						value={ attributes?.postType || '__nc-all' }
						options={ [
							{
								value: '__nc-all' as const,
								label: _x(
									'All Content',
									'text',
									'nelio-content'
								),
							},
							...postTypes.map( ( pt ) => ( {
								value: pt.name,
								label:
									pt.labels.plural ||
									pt.labels.singular ||
									pt.name,
							} ) ),
						] }
						onChange={ ( value ) =>
							value === '__nc-all'
								? setAttributes( { postType: undefined } )
								: setAttributes( { postType: value } )
						}
					/>
				</div>
			);

		case 'taxonomy':
			return (
				<div className="nelio-content-social-template-editor-dialog__extra">
					{ taxonomies.map( ( t ) => (
						<ItemSelectControl
							key={ t.slug }
							error={
								templateErrors.taxonomies[
									t.slug as TaxonomySlug
								]
							}
							isSingle
							kind="taxonomy"
							label={ t.labels.singular_name }
							name={ t.slug }
							value={
								attributes.taxonomies[ t.slug as TaxonomySlug ]
							}
							onChange={ ( value ) =>
								setAttributes( {
									taxonomies: removeUndefinedTaxonomies( {
										...attributes.taxonomies,
										[ t.slug ]: value ? value : undefined,
									} ),
								} )
							}
						/>
					) ) }
				</div>
			);

		case 'author':
			return (
				<div className="nelio-content-social-template-editor-dialog__extra">
					<ItemSelectControl
						isSingle
						error={ templateErrors.author }
						kind="author"
						label={ _x( 'Author', 'text', 'nelio-content' ) }
						value={ author }
						onChange={ ( value ) =>
							setAttributes( { author: value } )
						}
					/>
				</div>
			);

		case 'availability':
			return (
				<div className="nelio-content-social-template-editor-dialog__extra">
					<AvailabilityControl />
				</div>
			);

		case 'attachment':
			return (
				<div className="nelio-content-social-template-editor-dialog__extra">
					<SelectControl
						options={ [
							{
								label: _x(
									'Auto Image',
									'text',
									'nelio-content'
								),
								value: 'auto-image' as const,
							},
							{
								label: _x( 'Text', 'text', 'nelio-content' ),
								value: 'none' as const,
							},
							{
								label: _x( 'Image', 'text', 'nelio-content' ),
								value: 'image' as const,
							},
							attributes?.attachment === 'video'
								? {
										label: _x(
											'Video',
											'text',
											'nelio-content'
										),
										value: 'video' as const,
								  }
								: undefined,
						].filter( isDefined ) }
						value={ attributes?.attachment || 'auto-image' }
						onChange={ ( value ) =>
							setAttributes( {
								attachment:
									'auto-image' === value ? undefined : value,
							} )
						}
						help={ attachmentExplanation }
					/>
				</div>
			);
	} //end switch
};

const TABS = {
	postType: {
		icon: 'admin-post' as const,
		title: _x( 'Post Type', 'text', 'nelio-content' ),
	},
	taxonomy: {
		icon: 'archive' as const,
		title: _x( 'Taxonomies', 'text', 'nelio-content' ),
	},
	author: {
		icon: 'admin-users' as const,
		title: _x( 'Author', 'text', 'nelio-content' ),
	},
	availability: {
		icon: 'calendar-alt' as const,
		title: _x( 'Availability', 'text', 'nelio-content' ),
	},
	attachment: {
		icon: 'format-gallery' as const,
		title: _x( 'Media Requirements', 'text', 'nelio-content' ),
	},
};

type Tab = keyof typeof TABS;

type TabSelectorProps = {
	readonly className?: string;
	readonly availableTabs: ReadonlyArray< Tab | false >;
	readonly tab: Tab;
	readonly setTab: ( tab: Tab ) => void;
};

const TabSelector = ( {
	className,
	availableTabs,
	tab,
	setTab,
}: TabSelectorProps ): JSX.Element => (
	<Toolbar
		className={ className }
		label={ _x( 'Settings', 'text', 'nelio-content' ) }
	>
		{ availableTabs
			.filter( ( at ): at is Tab => !! at )
			.map( ( at ) => (
				<ToolbarButton
					key={ at }
					className={ `nelio-content-social-template-editor__${ at }-action` }
					icon={ TABS[ at ].icon }
					title={ TABS[ at ].title }
					isActive={ tab === at }
					onClick={ () => setTab( at ) }
				/>
			) ) }
	</Toolbar>
);

// =====
// HOOKS
// =====

const useIsOpen = () =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isEditingTemplate()
	);

const useGroupPostTypes = (
	groupId: Maybe< AutomationGroupId >
): ReadonlyArray< PostType > => {
	const group = useAutomationGroup( groupId );
	const postTypes = usePostTypes( 'social' );
	return postTypes.filter(
		( pt ) => isUniversalGroup( group ) || pt.name === group?.postType
	);
};

const useDetails = () => {
	const isOpen = useIsOpen();
	const [ attributes ] = useAttributes();
	const [ areDetailsVisible, showDetails ] = useState( false );

	useEffect( () => {
		if ( ! isOpen ) {
			showDetails( false );
		} else {
			showDetails(
				!! attributes?.author ||
					!! keys( attributes?.taxonomies ).length ||
					!! attributes?.availability
			);
		} //end if
	}, [ isOpen ] );

	return [ areDetailsVisible, showDetails ] as const;
};

const useAttributes = () => {
	const attributes = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplate()
	);
	const { setEditingTemplateAttributes: setAttributes } = useDispatch(
		NC_AUTOMATION_SETTINGS
	);
	return [ attributes, setAttributes ] as const;
};

const useEditingNetworkTemplate = () => {
	const value = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isEditingNetworkTemplate()
	);
	const { markAsNetworkTemplate } = useDispatch( NC_AUTOMATION_SETTINGS );
	return [ value, markAsNetworkTemplate ] as const;
};

const useAdditionalAttributes = () => {
	const isNewTemplate = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isEditingNewTemplate()
	);
	const templateType = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplateType()
	);
	return {
		isNewTemplate,
		templateType,
	};
};

const useSaveError = (): string => {
	const errors = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getEditingTemplateErrors()
	);

	const generic = errors.target || errors.content;
	if ( generic ) {
		return generic;
	} //end if

	if ( errors.author ) {
		return errors.author;
	} //end if

	if ( values( errors.taxonomies ).some( Boolean ) ) {
		return _x( 'Please review selected terms', 'user', 'nelio-content' );
	} //end if

	if ( errors.availability ) {
		return _x(
			'Please review availability settings',
			'user',
			'nelio-content'
		);
	} //end if

	return '';
};

const useValidationEffect = () => {
	const isOpen = useIsOpen();
	const [ attributes ] = useAttributes();
	const { setEditingTemplateErrors } = useDispatch( NC_AUTOMATION_SETTINGS );
	const group = useAutomationGroup( attributes?.groupId );

	const errors = useTemplateErrors( group, attributes ? [ attributes ] : [] );

	useEffect( () => {
		if ( ! isOpen || ! attributes?.id ) {
			return;
		} //end if
		const err = errors[ attributes.id ];
		if ( ! err ) {
			return;
		} //end if
		void setEditingTemplateErrors( err );
	}, [ isOpen, JSON.stringify( errors ) ] );
};

const useAttachmentExplanation = (
	attachment: SocialTemplate[ 'attachment' ]
): string => {
	switch ( attachment ) {
		case undefined:
			return _x(
				'Nelio Content may sometimes generate messages that share an image from related content',
				'text',
				'nelio-content'
			);
		case 'none':
			return _x(
				'Nelio Content won’t attach any images to messages generated using this template',
				'text',
				'nelio-content'
			);

		case 'image':
			return _x(
				'Nelio Content will only use this template if it can extract an image from shared content',
				'text',
				'nelio-content'
			);

		case 'video':
			return '';
	} //end switch
};

// =======
// HELPERS
// =======

const removeUndefinedTaxonomies = (
	o: Record< TaxonomySlug, Maybe< TermId > >
): Record< TaxonomySlug, TermId > =>
	keys( o ).reduce(
		( r, k: TaxonomySlug ) => ( o[ k ] ? { ...r, [ k ]: o[ k ] } : r ),
		{} as Record< TaxonomySlug, TermId >
	);

const getNetworkTitle = ( isNew: boolean ) =>
	isNew
		? _x( 'New Network Template', 'text', 'nelio-content' )
		: _x( 'Edit Network Template', 'text', 'nelio-content' );

const getTitle = ( isNew: boolean ) =>
	isNew
		? _x( 'New Template', 'text', 'nelio-content' )
		: _x( 'Edit Template', 'text', 'nelio-content' );
