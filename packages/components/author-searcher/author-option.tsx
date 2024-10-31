/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_DATA } from '@nelio-content/data';
import type { AuthorId } from '@nelio-content/types';
import type { OptionProps } from 'react-select';

/**
 * Internal dependencies
 */
import { AuthorIcon } from '../author-icon';

export type AuthorOptionProps = OptionProps< AuthorData > & {
	readonly allAuthorsLabel: string;
};

export type AuthorData = {
	readonly value: AuthorId;
	readonly label: string;
};

export const AuthorOption = ( {
	allAuthorsLabel,
	data: { value },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: AuthorOptionProps ): JSX.Element => {
	const author = useAuthor( value );
	const name = value ? author.name : allAuthorsLabel;
	const email = author.email;

	return (
		<div
			ref={ innerRef }
			className={ classnames( {
				'nelio-content-author-option-in-author-searcher': true,
				'nelio-content-author-option-in-author-searcher--is-focused':
					isFocused,
				'nelio-content-author-option-in-author-searcher--is-selected':
					isSelected,
			} ) }
			{ ...innerProps }
		>
			<div className="nelio-content-author-option-in-author-searcher__author-picture">
				<AuthorIcon authorId={ value } />
			</div>

			<div className="nelio-content-author-option-in-author-searcher__name">
				{ name }
			</div>

			<div className="nelio-content-author-option-in-author-searcher__email">
				{ email }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const DEFAULT_AUTHOR = { name: '', email: '' };

const useAuthor = ( authorId: AuthorId ): typeof DEFAULT_AUTHOR =>
	useSelect( ( select ) =>
		authorId
			? select( NC_DATA ).getAuthor( authorId ) || DEFAULT_AUTHOR
			: DEFAULT_AUTHOR
	);
