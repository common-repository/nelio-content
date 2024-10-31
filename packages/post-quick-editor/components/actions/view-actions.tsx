/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { ExtraAction } from './extra-action';

import { store as NC_POST_EDITOR } from '../../store';
import { useCanEditPost } from '../../hooks';

export const ViewActions = (): JSX.Element => {
	const { close } = useDispatch( NC_POST_EDITOR );
	const { primary, secondary } = useLinks();

	return (
		<div className="nelio-content-post-quick-editor__actions">
			<ExtraAction />

			<Button variant="secondary" onClick={ close }>
				{ _x( 'Cancel', 'command', 'nelio-content' ) }
			</Button>

			{ !! secondary && (
				<ExternalLink
					className="components-button is-secondary"
					href={ secondary.url }
					onClick={ close }
				>
					{ secondary.label }
				</ExternalLink>
			) }

			{ !! primary && (
				<ExternalLink
					className="components-button is-primary"
					href={ primary.url }
					onClick={ close }
				>
					{ primary.label }
				</ExternalLink>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

type UrlOption = {
	readonly url: Url;
	readonly label: string;
};

const useLinks = (): {
	readonly primary?: UrlOption;
	readonly secondary?: UrlOption;
} => {
	const post = useActualPost();
	const canEditPost = useCanEditPost();
	if ( ! post ) {
		return {};
	} //end if

	const { status, editLink, viewLink } = post;
	const isPublished = 'publish' === status;

	const view = {
		url: viewLink,
		label: isPublished
			? _x( 'View', 'command', 'nelio-content' )
			: _x( 'Preview', 'command', 'nelio-content' ),
	};

	const edit = {
		url: editLink,
		label: _x( 'Edit', 'command', 'nelio-content' ),
	};

	if ( ! canEditPost ) {
		return { secondary: view };
	} //end if

	return {
		primary: isPublished ? view : edit,
		secondary: isPublished ? edit : view,
	};
};

const useActualPost = () =>
	useSelect( ( select ) => {
		const { getPost } = select( NC_DATA );
		const { getId } = select( NC_POST_EDITOR );
		return getPost( getId() );
	} );
