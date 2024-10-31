/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { AuthorSearcher } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { AuthorId, Maybe } from '@nelio-content/types';

export type PostAuthorProps = {
	readonly value: Maybe< AuthorId >;
	readonly onChange: ( author: Maybe< AuthorId > ) => void;
};

export const PostAuthor = ( {
	onChange,
	value,
}: PostAuthorProps ): JSX.Element => {
	const currentUserId = useSelect( ( select ) =>
		select( NC_DATA ).getCurrentUserId()
	);

	return (
		<div className="nelio-content-post-filters__author">
			<span>{ _x( 'Author', 'text', 'nelio-content' ) }</span>

			<AuthorSearcher
				placeholder={ _x(
					'Search author…',
					'command',
					'nelio-content'
				) }
				value={ value }
				onChange={ onChange }
				hasAllAuthors={ true }
			/>

			<div className="nelio-content-post-filters__right-action">
				<Button
					variant="link"
					onClick={ () => onChange( currentUserId ) }
				>
					{ _x( 'Show My Posts', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</div>
	);
};
