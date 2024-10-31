/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useValidationError = (): [ string, ( v: string ) => void ] => {
	const error = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getValidationError()
	);
	const { setValidationError } = useDispatch( NC_SOCIAL_EDITOR );
	return [ error, setValidationError ];
};

export const useFailureDescription = (): string =>
	useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getFailureDescription()
	);

export const useEditor = (): {
	readonly isVisible: boolean;
	readonly close: () => void;
	readonly saveAndClose: () => void;
} => {
	const isVisible = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isEditorVisible()
	);
	const { close, saveAndClose } = useDispatch( NC_SOCIAL_EDITOR );
	return { isVisible, close, saveAndClose };
};

export const useIsNewMessage = (): boolean =>
	useSelect( ( select ) => !! select( NC_SOCIAL_EDITOR ).isNewMessage() );

export const useIsSaving = (): boolean =>
	useSelect( ( select ) => !! select( NC_SOCIAL_EDITOR ).isSaving() );

export const useIsSingleProfileLocked = (): boolean =>
	useSelect(
		( select ) =>
			! select( NC_SOCIAL_EDITOR ).isNewMessage() &&
			! select( NC_DATA ).isSubscribed()
	);

export const useIsMultiProfileSelector = (): boolean =>
	useSelect( ( select ) => {
		const { isNewMessage } = select( NC_SOCIAL_EDITOR );
		if ( ! isNewMessage() ) {
			return false;
		} //end if

		const { getSocialProfiles } = select( NC_DATA );
		const profiles = getSocialProfiles();
		return (
			1 < profiles.length ||
			profiles.some( ( p ) =>
				doesNetworkSupport( 'multi-target', p.network )
			)
		);
	} );
