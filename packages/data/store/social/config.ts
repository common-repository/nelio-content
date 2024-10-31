/**
 * External dependencies
 */
import type {
	RegularAutomationGroup,
	SocialProfile,
	SocialProfileTarget,
	UniversalAutomationGroup,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly profiles: {
		readonly byId: Record< Uuid, SocialProfile >;
		readonly allIds: ReadonlyArray< Uuid >;
	};
	readonly targets: Record< Uuid, ReadonlyArray< SocialProfileTarget > >;
	readonly automationGroups: {
		readonly byId: Record<
			RegularAutomationGroup[ 'id' ],
			RegularAutomationGroup
		> & { readonly universal: UniversalAutomationGroup };
		readonly allIds: [ 'universal', ...RegularAutomationGroup[ 'id' ][] ];
	};
	readonly resetStatus: 'ready' | 'resetting' | 'error' | 'done';
};

export const INIT: State = {
	profiles: {
		byId: {},
		allIds: [],
	},
	targets: {},
	automationGroups: {
		byId: {
			universal: {
				id: 'universal',
				priority: 100,
				publication: { type: 'always' },
				profileSettings: {},
				networkSettings: {},
			},
		},
		allIds: [ 'universal' ],
	},
	resetStatus: 'ready',
};
