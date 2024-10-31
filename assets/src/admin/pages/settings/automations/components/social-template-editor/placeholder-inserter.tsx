/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@safe-wordpress/components';
import { store as CORE } from '@safe-wordpress/core-data';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { isDefined } from '@nelio-content/utils';
import type { Taxonomy, TaxonomySlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	useCustomFields,
	useCustomPlaceholders,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

// NOTE. This is a workaround because, for some reason, clicking outside the dropdown doesn’t work if the click is still inside the modal window.
let doCloseMenu: () => void;
const closeMenuOnBlur = () => {
	if ( 'function' === typeof doCloseMenu ) {
		doCloseMenu();
	} //end if
};

export type PlaceholderInserterProps = {
	readonly onClick: ( value: string ) => void;
};

export const PlaceholderInserter = ( {
	onClick,
}: PlaceholderInserterProps ): JSX.Element => {
	const type = usePostType();
	const supports = useSupports();
	const customFields = useCustomFields( type );
	const customPlaceholders = useCustomPlaceholders( type );
	const taxonomies = useSupportedTaxonomies();

	return (
		<DropdownMenu
			className="nelio-content-social-template-editor-dialog__quick-action nelio-content-social-template-editor-dialog__add-placeholder"
			icon="tag"
			label={ _x( 'Placeholders', 'text', 'nelio-content' ) }
			toggleProps={ {
				tooltipPosition: 'bottom center',
			} }
			popoverProps={ {
				onFocusOutside: closeMenuOnBlur,
			} }
		>
			{ ( { onClose }: { onClose: () => void } ) => {
				// NOTE. This is part of the workaround mentioned before.
				doCloseMenu = onClose;

				return (
					<MenuGroup>
						<MenuGroup>
							{ supports.title && (
								<MenuItem
									role="menuitem"
									icon="editor-textcolor"
									onClick={ () => onClick( '{title}' ) }
								>
									{ _x(
										'Add Title',
										'command',
										'nelio-content'
									) }
								</MenuItem>
							) }

							<MenuItem
								role="menuitem"
								icon="format-status"
								onClick={ () => onClick( '{phrase}' ) }
							>
								{ _x(
									'Add Content Phrase',
									'command',
									'nelio-content'
								) }
							</MenuItem>

							<MenuItem
								role="menuitem"
								icon="editor-quote"
								onClick={ () => onClick( '{highlight}' ) }
							>
								{ _x(
									'Add Highlight',
									'command',
									'nelio-content'
								) }
							</MenuItem>

							{ supports.author && (
								<MenuItem
									role="menuitem"
									icon="admin-users"
									onClick={ () => onClick( '{author}' ) }
								>
									{ _x(
										'Add Author',
										'command',
										'nelio-content'
									) }
								</MenuItem>
							) }

							{ supports.excerpt && (
								<MenuItem
									role="menuitem"
									icon="text"
									onClick={ () => onClick( '{excerpt}' ) }
								>
									{ _x(
										'Add Excerpt',
										'command',
										'nelio-content'
									) }
								</MenuItem>
							) }

							<MenuItem
								role="menuitem"
								icon="admin-links"
								onClick={ () => onClick( '{permalink}' ) }
							>
								{ _x(
									'Add Permalink',
									'command',
									'nelio-content'
								) }
							</MenuItem>
						</MenuGroup>

						{ !! taxonomies.length && (
							<MenuGroup
								label={ _x(
									'Taxonomies',
									'text',
									'nelio-content'
								) }
							>
								{ taxonomies.map( ( { slug, labels } ) => (
									<MenuItem
										key={ slug }
										role="menuitem"
										icon={ getTaxIcon(
											slug as TaxonomySlug
										) }
										onClick={ () =>
											onClick(
												getTaxPlaceholder(
													slug as TaxonomySlug
												)
											)
										}
									>
										{ sprintf(
											/* translators: taxonomy name */
											_x(
												'Add %s',
												'command',
												'nelio-content'
											),
											labels.name
										) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }

						{ !! customFields.length && (
							<MenuGroup
								label={ _x(
									'Custom fields',
									'text',
									'nelio-content'
								) }
							>
								{ customFields.map( ( { key, name } ) => (
									<MenuItem
										key={ key }
										role="menuitem"
										icon="welcome-widgets-menus"
										onClick={ () =>
											onClick( `{field:${ key }}` )
										}
									>
										{ sprintf(
											/* translators: custom field name */
											_x(
												'Add %s',
												'command',
												'nelio-content'
											),
											name
										) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }

						{ !! customPlaceholders.length && (
							<MenuGroup
								label={ _x(
									'Custom placeholders',
									'text',
									'nelio-content'
								) }
							>
								{ customPlaceholders.map( ( { key, name } ) => (
									<MenuItem
										key={ key }
										role="menuitem"
										icon="plus-alt"
										onClick={ () =>
											onClick( `{custom:${ key }}` )
										}
									>
										{ sprintf(
											/* translators: custom placeholder name */
											_x(
												'Add %s',
												'command',
												'nelio-content'
											),
											name
										) }
									</MenuItem>
								) ) }
							</MenuGroup>
						) }
					</MenuGroup>
				);
			} }
		</DropdownMenu>
	);
};

// =====
// HOOKS
// =====

const useSupports = () => {
	const type = usePostType();
	return useSelect( ( select ) => {
		const compatibleTypes = ! type
			? map( select( NC_DATA ).getPostTypes( 'social' ), 'name' )
			: [ type ];

		const { getEntityRecord } = select( CORE );
		const types = compatibleTypes
			.map( ( t ) => getEntityRecord( 'root', 'postType', t ) )
			.filter( isPostType )
			.filter( isDefined );

		return {
			author: types.some( ( t ) => !! t.supports?.author ),
			excerpt: types.some( ( t ) => !! t.supports?.excerpt ),
			title: types.some( ( t ) => !! t.supports?.title ),
		};
	} );
};

const usePostType = () =>
	useSelect(
		( select ) =>
			select( NC_AUTOMATION_SETTINGS ).getEditingTemplate()?.postType
	);

const useSupportedTaxonomies = () =>
	useSelect( ( select ): ReadonlyArray< Taxonomy > => {
		select( CORE );
		select( NC_DATA );
		const { getEditingTemplate } = select( NC_AUTOMATION_SETTINGS );

		const template = getEditingTemplate();
		if ( ! template ) {
			return [];
		} //end if

		const { getPostTypes } = select( NC_DATA );
		const postTypes = template.postType
			? [ template.postType ]
			: map( getPostTypes( 'social' ), 'name' ) ?? [];

		const { getEntityRecords } = select( CORE );
		const taxonomies =
			getEntityRecords( 'root', 'taxonomy', { per_page: -1 } ) ?? [];
		return taxonomies
			.filter( ( t ): t is Taxonomy => !! t )
			.filter(
				( tax ) =>
					tax.visibility.public &&
					postTypes.some( ( postType ) =>
						tax.types.includes( postType )
					)
			);
	} );

// =======
// HELPERS
// =======

type PostType = {
	readonly supports?: {
		readonly author?: boolean;
		readonly excerpt?: boolean;
		readonly title?: boolean;
	};
	readonly taxonomies?: ReadonlyArray< string >;
};

const isPostType = ( pt?: unknown ): pt is PostType => !! pt;

const getTaxIcon = ( tax: TaxonomySlug ) => {
	switch ( tax ) {
		case 'category':
		case 'product_cat':
			return 'category';
		case 'post_tag':
		case 'product_tag':
			return 'tag';
		default:
			return 'archive';
	} //end switch
};

const getTaxPlaceholder = ( tax: TaxonomySlug ) => {
	switch ( tax ) {
		case 'category':
		case 'product_cat':
			return '{categories}';
		case 'post_tag':
		case 'product_tag':
			return '{tags}';
		default:
			return `{taxonomy:${ tax }}`;
	} //end switch
};
