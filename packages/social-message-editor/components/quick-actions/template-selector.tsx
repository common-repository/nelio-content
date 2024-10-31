/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import type { SocialTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../store';
import {
	useDoesActiveNetworkSupport,
	useRelatedPost,
	usePostTemplates,
} from '../../hooks';

// NOTE. This is a workaround because, for some reason, clicking outside the dropdown doesn’t work if the click is still inside the modal window.
let doCloseMenu: () => void;
const closeMenuOnBlur = () => {
	if ( 'function' === typeof doCloseMenu ) {
		doCloseMenu();
	} //end if
};

export type TemplateSelectorProps = {
	readonly disabled?: boolean;
};

export const TemplateSelector = ( {
	disabled,
}: TemplateSelectorProps ): JSX.Element | null => {
	const supportsText = useDoesActiveNetworkSupport( 'text' );
	const [ post ] = useRelatedPost();
	const { recommendedTemplates, otherTemplates } = usePostTemplates( post );
	const { setText } = useDispatch( NC_SOCIAL_EDITOR );

	if ( ! supportsText ) {
		return null;
	} //end if

	const hasRecommendedTemplates = !! recommendedTemplates.length;
	const hasOtherTemplates = !! otherTemplates.length;
	const hasTemplates = hasRecommendedTemplates || hasOtherTemplates;

	if ( ! hasTemplates ) {
		return null;
	} //end if

	return (
		<DropdownMenu
			className="nelio-content-social-message-editor__quick-action nelio-content-social-message-editor__use-template"
			icon={ <TemplateIcon /> }
			label={ _x( 'Templates', 'command', 'nelio-content' ) }
			toggleProps={ {
				disabled: !! disabled,
				tooltipPosition: 'bottom center',
			} }
			popoverProps={ { onFocusOutside: closeMenuOnBlur } }
		>
			{ ( { onClose }: { onClose: () => void } ) => {
				// NOTE. This is part of the workaround mentioned before.
				doCloseMenu = onClose;

				return (
					<MenuGroup>
						<TemplateList
							title={ _x(
								'Recommended',
								'text (templates)',
								'nelio-content'
							) }
							templates={ recommendedTemplates }
							onClick={ ( text ) => {
								onClose();
								void setText( text );
							} }
						/>
						<TemplateList
							title={
								hasRecommendedTemplates
									? _x(
											'Other Templates',
											'text',
											'nelio-content'
									  )
									: _x(
											'Available Templates',
											'text',
											'nelio-content'
									  )
							}
							templates={ otherTemplates }
							onClick={ ( text ) => {
								onClose();
								void setText( text );
							} }
						/>
					</MenuGroup>
				);
			} }
		</DropdownMenu>
	);
};

// ============
// HELPER VIEWS
// ============

type TemplateListProps = {
	readonly title: string;
	readonly templates: ReadonlyArray< SocialTemplate >;
	readonly onClick: ( text: string ) => void;
};

const TemplateList = ( {
	title,
	templates,
	onClick,
}: TemplateListProps ): JSX.Element | null => {
	if ( ! templates.length ) {
		return null;
	} //end if

	if ( ! title ) {
		return (
			<>
				{ templates.map( ( { id, text } ) => (
					<MenuItem
						key={ `template-${ id }` }
						role="menuitem"
						onClick={ () => onClick( text ) }
					>
						{ shorten( text ) }
					</MenuItem>
				) ) }
			</>
		);
	} //end if

	return (
		<MenuGroup label={ title }>
			{ templates.map( ( { id, text } ) => (
				<MenuItem
					key={ `template-${ id }` }
					role="menuitem"
					onClick={ () => onClick( text ) }
				>
					{ shorten( text ) }
				</MenuItem>
			) ) }
		</MenuGroup>
	);
};

const TemplateIcon = () => (
	<svg viewBox="0 0 20 20" width="20" height="20">
		<path d="M 3 2 C 2.45 2 2 2.45 2 3 L 2 17 C 2 17.55 2.45 18 3 18 L 18 18 C 18.55 18 19 17.55 19 17 L 19 3 C 19 2.45 18.55 2 18 2 L 3 2 z M 4 4 L 17 4 L 17 16 L 4 16 L 4 4 z M 5 5 L 5 9 L 7 9 L 7 8 L 6 8 L 6 6 L 7 6 L 7 5 L 5 5 z M 8 5 L 8 6 L 9 6 L 9 5 L 8 5 z M 10 5 L 10 6 L 11 6 L 11 5 L 10 5 z M 12 5 L 12 6 L 13 6 L 13 5 L 12 5 z M 14 5 L 14 6 L 15 6 L 15 8 L 14 8 L 14 9 L 16 9 L 16 5 L 14 5 z M 8 8 L 8 9 L 9 9 L 9 8 L 8 8 z M 10 8 L 10 9 L 11 9 L 11 8 L 10 8 z M 12 8 L 12 9 L 13 9 L 13 8 L 12 8 z M 5 11 L 5 15 L 7 15 L 7 14 L 6 14 L 6 12 L 7 12 L 7 11 L 5 11 z M 8 11 L 8 12 L 9 12 L 9 11 L 8 11 z M 10 11 L 10 12 L 11 12 L 11 11 L 10 11 z M 12 11 L 12 12 L 13 12 L 13 11 L 12 11 z M 14 11 L 14 12 L 15 12 L 15 14 L 14 14 L 14 15 L 16 15 L 16 11 L 14 11 z M 8 14 L 8 15 L 9 15 L 9 14 L 8 14 z M 10 14 L 10 15 L 11 15 L 11 14 L 10 14 z M 12 14 L 12 15 L 13 15 L 13 14 L 12 14 z " />
	</svg>
);

// =======
// HELPERS
// =======

const shorten = ( t: string ) =>
	80 < t.length ? trim( t.substring( 0, 75 ) ) + '…' : t;
