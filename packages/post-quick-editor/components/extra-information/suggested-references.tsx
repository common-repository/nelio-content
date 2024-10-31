/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink, TextControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isUrl } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../store';

export const SuggestedReferences = (): JSX.Element => {
	const { references, referenceInput } = useSelect( ( select ) => ( {
		referenceInput: select( NC_POST_EDITOR ).getReferenceInput(),
		references: select( NC_POST_EDITOR ).getReferences(),
	} ) );

	const { setReferenceInput, setReferences } = useDispatch( NC_POST_EDITOR );

	const url = trim( referenceInput );
	const isValidUrl =
		isUrl( url ) && ! references.some( ( r ) => r.url === url );

	const onAdd = () => {
		if ( ! isUrl( url ) ) {
			return;
		} //end if
		void setReferences( [ ...references, { url, title: '' } ] );
		void setReferenceInput( '' );
	};

	return (
		<div className="nelio-content-pqe-extra__references">
			<ul className="nelio-content-pqe-extra__reference-list">
				{ references.map( ( r, i ) => (
					<li key={ `nelio-content-reference-${ i }` }>
						<ExternalLink href={ r.url }>
							{ r.title || r.url }
						</ExternalLink>
					</li>
				) ) }
			</ul>
			<div className="nelio-content-pqe-extra__new-reference">
				<TextControl
					autoComplete="off"
					placeholder={ _x(
						'Suggest reference…',
						'user',
						'nelio-content'
					) }
					value={ referenceInput }
					onChange={ setReferenceInput }
				/>
				<Button
					variant="secondary"
					onClick={ onAdd }
					disabled={ ! isValidUrl }
				>
					{ _x( 'Add', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</div>
	);
};
