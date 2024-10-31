/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * Extenral dependencies
 */
import { useAuthorName, useIsUserYou } from '@nelio-content/data';
import type { EditorialReference, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { DiscardButton } from './discard-button';
import { store as NC_EDIT_POST } from '../../../store';

export type LinkProps = {
	readonly link: Url;
};

export const Link = ( { link }: LinkProps ): JSX.Element => {
	return (
		<div className="nelio-content-link-reference">
			<ReferenceTitle link={ link } />
			<ExtraInformation link={ link } />
			<Advisor link={ link } />
			<Actions link={ link } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const ReferenceTitle = ( { link }: Pick< LinkProps, 'link' > ) => {
	const { title, url } = useReference( link );
	if ( ! title ) {
		return (
			<div className="nelio-content-link-reference__title">
				<ExternalLink href={ url }>{ url }</ExternalLink>
			</div>
		);
	} //end if

	return (
		<>
			<div className="nelio-content-link-reference__title">{ title }</div>
			<div className="nelio-content-link-reference__link">
				<ExternalLink href={ url }>{ url }</ExternalLink>
			</div>
		</>
	);
};

const ExtraInformation = ( { link }: Pick< LinkProps, 'link' > ) => {
	const isLoading = useIsLoading( link );

	const reference = useReference( link );
	const { author, email, twitter } = reference;

	if ( isLoading ) {
		return (
			<div className="nelio-content-link-reference__extra">
				{ _x( 'Loading…', 'text', 'nelio-content' ) }
			</div>
		);
	} //end if

	if ( ! twitter && ! email ) {
		return (
			<div className="nelio-content-link-reference__extra">
				<div className="nelio-content-link-reference__author">
					{ author ||
						_x( 'Unknown Author', 'text', 'nelio-content' ) }
				</div>
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-link-reference__extra">
			<div className="nelio-content-link-reference__author">
				{ author || _x( 'Unknown Author', 'text', 'nelio-content' ) }
			</div>

			<div className="nelio-content-link-reference__contact">
				{ !! twitter && (
					<ExternalLink href={ `https://twitter.com/${ twitter }` }>
						<Dashicon
							className="nelio-content-link-reference__contact-icon"
							icon="twitter"
						/>
					</ExternalLink>
				) }{ ' ' }
				{ !! email && (
					<ExternalLink href={ `mailto:${ email }` }>
						<Dashicon
							className="nelio-content-link-reference__contact-icon"
							icon="email"
						/>
					</ExternalLink>
				) }
			</div>
		</div>
	);
};

const Advisor = ( { link }: LinkProps ) => {
	const ref = useReference( link );
	const areYouTheAdvisor = useIsUserYou( ref?.suggestionAdvisorId );
	const advisorName = useAuthorName( ref?.suggestionAdvisorId );

	if ( ! ref ) {
		return (
			<div className="nelio-content-link-reference__advisor">
				{ _x( 'Suggested by someone', 'text', 'nelio-content' ) }
			</div>
		);
	} //end if

	if ( ! ref.suggestionAdvisorId || areYouTheAdvisor ) {
		return (
			<div className="nelio-content-link-reference__advisor">
				{ _x( 'Suggested by you', 'text', 'nelio-content' ) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-link-reference__advisor">
			{ ! advisorName
				? _x( 'Suggested by someone', 'text', 'nelio-content' )
				: sprintf(
						/* translators: author name */
						_x( 'Suggested by %s', 'text', 'nelio-content' ),
						advisorName
				  ) }
		</div>
	);
};

const Actions = ( { link }: LinkProps ) => {
	const isLoading = useIsLoading( link );
	const { openReferenceEditor } = useDispatch( NC_EDIT_POST );
	const { discardReference } = useDispatch( NC_EDIT_POST );

	if ( isLoading ) {
		return (
			<div className="nelio-content-link-reference__actions">
				{ sprintf(
					'%1$s | %2$s',
					_x( 'Discard', 'command', 'nelio-content' ),
					_x( 'Edit', 'command', 'nelio-content' )
				) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-link-reference__actions">
			<DiscardButton onClick={ () => discardReference( link ) } />
			{ ' | ' }
			<Button
				variant="link"
				onClick={ () => openReferenceEditor( link ) }
			>
				{ _x( 'Edit', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const useReference = ( link: Url ) =>
	useSelect( ( select ): Omit< EditorialReference, 'id' > => {
		const { twitter, ...reference }: Omit< EditorialReference, 'id' > = {
			author: '',
			date: '',
			email: '',
			isExternal: true,
			isSuggestion: true,
			status: 'pending',
			title: '',
			twitter: '',
			...select( NC_EDIT_POST ).getReferenceByUrl( link ),
			url: link,
		};
		return {
			...reference,
			twitter: /^@/.test( twitter ) ? twitter.substring( 1 ) : twitter,
		};
	} );

const useIsLoading = ( link: Url ) =>
	useSelect( ( select ) =>
		select( NC_EDIT_POST ).isReferenceLoading( link )
	);
