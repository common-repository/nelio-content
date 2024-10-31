/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Maybe, Uuid, Percentage, Weekday } from './utils';
import type { SocialNetworkName } from './social-networks';
import type { SocialTargetName } from './social-profiles';
import type {
	AuthorId,
	PostTypeName,
	TaxonomySlug,
	TermId,
} from './wordpress-entities';

export type AutomationGroup = UniversalAutomationGroup | RegularAutomationGroup;

export type AutomationGroupId = AutomationGroup[ 'id' ];

export type UniversalAutomationGroup = Omit<
	RegularAutomationGroup,
	'id' | 'name' | 'postType' | 'taxonomies' | 'authors'
> & { readonly id: 'universal' };

export type RegularAutomationGroupId = Brand<
	string,
	'RegularAutomationGroupId'
>;

export type RegularAutomationGroup = {
	readonly id: RegularAutomationGroupId;
	readonly name: string;
	readonly priority: Percentage;
	readonly postType: PostTypeName;
	readonly taxonomies: Record< TaxonomySlug, ReadonlyArray< TermId > >;
	readonly authors: ReadonlyArray< AuthorId >;
	readonly publication: AutomationGroupPublicationSettings;
	readonly profileSettings: Record< Uuid, ProfileAutomationSettings >;
	readonly networkSettings: Partial<
		Record< SocialNetworkName, NetworkAutomationSettings >
	>;
};

export type ProfileAutomationSettings = {
	readonly profileId: Uuid;
	readonly network: SocialNetworkName;
	readonly enabled: boolean;
	readonly publication: {
		readonly enabled: boolean;
		readonly templates: ReadonlyArray< SocialTemplate >;
	};
	readonly reshare: {
		readonly enabled: boolean;
		readonly templates: ReadonlyArray< SocialTemplate >;
	};
};

export type NetworkAutomationSettings = {
	readonly name: SocialNetworkName;
	readonly publication: {
		readonly templates: ReadonlyArray< SocialTemplate >;
	};
	readonly reshare: {
		readonly templates: ReadonlyArray< SocialTemplate >;
	};
};

export type AutomationGroupPublicationSettings =
	| {
			readonly type: 'always';
	  }
	| {
			readonly type: 'max-age';
			readonly days: number;
	  };

export type SocialTemplate = {
	readonly groupId: AutomationGroupId;
	readonly id: Uuid;
	readonly author?: AuthorId;
	readonly creatorId: AuthorId;
	readonly network: SocialNetworkName;
	readonly profileId?: Uuid;
	readonly targetName?: SocialTargetName;
	readonly postType: Maybe< PostTypeName >;
	readonly taxonomies: Record< TaxonomySlug, TermId >;
	readonly text: string;
	readonly attachment?: 'none' | 'image' | 'video';
	readonly availability?: SocialTemplateAvailability;
};

export type SocialTemplateAvailability =
	| {
			readonly type: 'publication-day-offset';
			readonly hoursAfterPublication: number;
			// TODO. Future stuff
			readonly randomize?: number;
			readonly recurrency?: SocialTemplateRecurrency;
	  }
	| {
			readonly type: 'publication-day-period';
			readonly time: TimeString;
			// TODO. Future stuff
			readonly randomize?: number;
			readonly recurrency?: SocialTemplateRecurrency;
	  }
	| {
			readonly type: 'after-publication';
			readonly daysAfterPublication: number;
			readonly time: TimeString;
			// TODO. Future stuff
			readonly randomize?: number;
			readonly recurrency?: SocialTemplateRecurrency;
	  }
	| {
			readonly type: 'reshare';
			readonly weekday: Record< Weekday, boolean >;
			readonly time: TimeString;
			// TODO. Future stuff
			readonly randomize?: number;
	  };

export type SocialTemplateRecurrency = {
	readonly instanceCount: number;
	readonly intervalInDays: number;
};

export type TimeInterval = 'morning' | 'noon' | 'afternoon' | 'night';
export type ExactTime = `${ string }:${ string }`;

export type TimeString = TimeInterval | ExactTime;

export type ExportedSocialTemplate = Pick<
	SocialTemplate,
	'text' | 'availability'
> &
	Partial< Pick< SocialTemplate, 'author' | 'postType' | 'taxonomies' > > &
	ExportedTemplateType;

type ExportedTemplateType =
	| { readonly isNetwork: true }
	| {
			readonly isNetwork: false;
			readonly targetName?: SocialTargetName;
	  };

export type AutoShareEndModeId =
	| 'never'
	| '1-month'
	| '2-months'
	| '3-months'
	| '6-months'
	| '1-year';

export type AutoShareEndMode = {
	readonly value: AutoShareEndModeId;
	readonly label: string;
	readonly months: number;
};

export type Highlight = {
	readonly text: string;
	readonly html: string;
};

export type AutomationSources = {
	readonly useCustomSentences: boolean;
	readonly customSentences: ReadonlyArray< string >;
};
