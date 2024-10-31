/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { values } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import type { TaxonomySlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	useDoesActiveNetworkSupport,
	useRelatedPost,
	useText,
	usePostSupports,
	useSupportedTaxonomies,
} from '../../hooks';

// NOTE. This is a workaround because, for some reason, clicking outside the dropdown doesn’t work if the click is still inside the modal window.
let doCloseMenu: () => void;
const closeMenuOnBlur = () => {
	if ( 'function' === typeof doCloseMenu ) {
		doCloseMenu();
	} //end if
};

export type PlaceholderInserterProps = {
	readonly disabled?: boolean;
};

export const PlaceholderInserter = ( {
	disabled,
}: PlaceholderInserterProps ): JSX.Element | null => {
	const supportsText = useDoesActiveNetworkSupport( 'text' );
	const [ post ] = useRelatedPost();
	const [ text, setText ] = useText();

	const customFields = values( post?.customFields );
	const customPlaceholders = values( post?.customPlaceholders );

	const doesPostSupportAuthor = usePostSupports( 'author', post );
	const doesPostSupportExcerpt = usePostSupports( 'excerpt', post );

	const taxonomies = useSupportedTaxonomies( post );

	const doesPostHasCustomFields = !! customFields.length;
	const doesPostHasCustomPlaceholders = !! customPlaceholders.length;

	if ( ! supportsText ) {
		return null;
	} //end if

	if ( isEmpty( post ) ) {
		return null;
	} //end if

	return (
		<DropdownMenu
			className="nelio-content-social-message-editor__quick-action nelio-content-social-message-editor__add-placeholder"
			icon="tag"
			label={ _x( 'Placeholders', 'text', 'nelio-content' ) }
			toggleProps={ {
				disabled: ! post || !! disabled,
				tooltipPosition: 'bottom center',
			} }
			popoverProps={ {
				onFocusOutside: closeMenuOnBlur,
			} }
		>
			{ ( { onClose }: { onClose: () => void } ) => {
				// NOTE. This is part of the workaround mentioned before.
				doCloseMenu = onClose;

				const appendTag = ( tag: string ) =>
					setText(
						/[^\s]$/.test( text )
							? `${ text } ${ tag }`
							: `${ text }${ tag }`
					);

				return (
					<MenuGroup>
						<MenuGroup>
							<MenuItem
								role="menuitem"
								icon="editor-textcolor"
								onClick={ () => appendTag( '{title}' ) }
							>
								{ _x(
									'Add Title',
									'command',
									'nelio-content'
								) }
							</MenuItem>

							{ doesPostSupportAuthor && (
								<MenuItem
									role="menuitem"
									icon="admin-users"
									onClick={ () => appendTag( '{author}' ) }
								>
									{ _x(
										'Add Author',
										'command',
										'nelio-content'
									) }
								</MenuItem>
							) }

							{ doesPostSupportExcerpt && (
								<MenuItem
									role="menuitem"
									icon="text"
									onClick={ () => appendTag( '{excerpt}' ) }
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
								onClick={ () => appendTag( '{permalink}' ) }
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
											appendTag(
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

						{ doesPostHasCustomFields && (
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
											appendTag( `{field:${ key }}` )
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

						{ doesPostHasCustomPlaceholders && (
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
											appendTag( `{custom:${ key }}` )
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

// =======
// HELPERS
// =======

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
