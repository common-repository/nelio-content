/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { LoadingAnimation } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export type AccountProviderProps = {
	readonly children: JSX.Element | JSX.Element[];
};

export const AccountProvider = ( {
	children,
}: AccountProviderProps ): JSX.Element => {
	const isLoading = useIsLoading();
	const { notices, removeNotice } = useNotices();

	if ( isLoading ) {
		return (
			<LoadingAnimation
				text={ _x( 'Loading…', 'text', 'nelio-content' ) }
			/>
		);
	} //end if

	return (
		<>
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			{ children }
		</>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect( ( select ) => {
		select( NC_ACCOUNT ).getAccount();
		return ! select( NC_ACCOUNT ).hasFinishedResolution( 'getAccount' );
	} );

const useNotices = () => {
	const notices = useSelect( ( select ) => select( NOTICES ).getNotices() );
	const { removeNotice } = useDispatch( NOTICES );
	return { notices, removeNotice };
};
