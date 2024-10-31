/**
 * External dependencies
 */
import type {
	Maybe,
	SocialNetworkName,
	SocialProfile,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly connection: {
		readonly connectionDialog: Maybe< Window >;
		readonly kindDialog: Maybe< SocialNetworkName >;
	};

	readonly profileEditor: {
		readonly profileId: Maybe< Uuid >;
		readonly isSaving: boolean;
		readonly settings: Pick<
			Required< SocialProfile >,
			'email' | 'permalinkQueryArgs'
		>;
	};

	readonly profileList: {
		readonly deleting: ReadonlyArray< Uuid >;
		readonly isRefreshing: boolean;
		readonly refreshing: ReadonlyArray< Uuid >;
	};
};

export type PublicationFrequencies = {
	readonly publicationFrequency: number;
	readonly reshareFrequency: number;
};
