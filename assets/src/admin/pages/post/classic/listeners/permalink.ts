/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { make } from 'ts-brand';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToPermalink( { setPermalink }: Actions ): void {
	const postNameField = document.getElementById(
		'post_name'
	) as HTMLInputElement;
	if ( ! postNameField ) {
		return;
	} //end if

	postNameField.addEventListener( 'change', () =>
		updatePermalink( postNameField, setPermalink )
	);

	const slugBox = document.getElementById( 'edit-slug-box' );
	if ( slugBox ) {
		slugBox.addEventListener( 'click', ( ev ) => {
			const target = ev.target as HTMLElement;
			if ( ! target?.closest( '#edit-slug-buttons .save' ) ) {
				return;
			} //end if
			updatePermalink( postNameField, setPermalink );
		} );
	} //end if
} //end listenToPermalink()

const updatePermalink = debounce(
	(
		postNameField: HTMLInputElement,
		setPermalink: Actions[ 'setPermalink' ]
	) => {
		const postName = postNameField.value;
		if ( ! postName ) {
			return;
		} //end if

		const { getPermalinkTemplate } = select( NC_EDIT_POST );
		const permalinkTemplate = getPermalinkTemplate();
		const permalink = make< Url >()(
			permalinkTemplate.replace( '%postname%', postName )
		);
		void setPermalink( permalink );
	},
	500
);
