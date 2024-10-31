/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as NC_POST_EDITOR } from '../../store';
import {
	useIsDisabled,
	useMayHaveExtraInfo,
	useSupportsTaxonomies,
} from '../../hooks';

export const ExtraAction = (): JSX.Element | null => {
	const { setExtraInfoTab } = useDispatch( NC_POST_EDITOR );
	const isExtraInfoVisible = useIsExtraInfoVisible();
	const mayHaveExtraInfo = useMayHaveExtraInfo();
	const disabled = useIsDisabled();
	const taxonomies = useSupportsTaxonomies();

	if ( ! mayHaveExtraInfo || isExtraInfoVisible ) {
		return null;
	} //end if

	const onClick = () =>
		setExtraInfoTab( taxonomies ? 'taxonomies' : 'tasks' );

	return (
		<div className="nelio-content-post-quick-editor__extra-actions">
			<Button
				className="nelio-content-post-quick-editor__extra-action"
				variant="link"
				disabled={ disabled }
				onClick={ onClick }
			>
				{ _x( 'View Details', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsExtraInfoVisible = () =>
	useSelect(
		( select ) => 'none' !== select( NC_POST_EDITOR ).getExtraInfoTab()
	);
