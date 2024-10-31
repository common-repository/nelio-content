/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch, subscribe } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { filter, isEqual, map, trim } from 'lodash';
import {
	getDisabledProfiles,
	processHtml,
	store as NC_EDIT_POST,
} from '@nelio-content/edit-post';
import { store as NC_DATA } from '@nelio-content/data';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import { getLinks, isEmpty } from '@nelio-content/utils';
import type {
	AuthorId,
	AutoShareEndMode,
	AwsPost,
	Dict,
	EditingPost,
	EditorialReference,
	Maybe,
	PostId,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { addListeners } from './listeners';

// =======
// EXPORTS
// =======

export type Args = {
	readonly attributes: {
		readonly externalFeatImage: {
			readonly url: Url;
			readonly alt: string;
		};
		readonly followers: ReadonlyArray< AuthorId >;
		readonly references: ReadonlyArray< EditorialReference >;
	};
	readonly postId: PostId;
	readonly settings: Settings;
};

export type Settings = {
	readonly isClassicEditor?: boolean;
	readonly isElementorEditor?: boolean;
	readonly dynamicSections: {
		readonly externalFeatImage: boolean;
		readonly notifications: boolean;
	};
	readonly nonce: string;
	readonly qualityAnalysis: QualityAnalysisSettings;
	readonly autoShareEndModes: ReadonlyArray< AutoShareEndMode >;
	readonly shouldAuthorBeFollower: boolean;
};

export type QualityAnalysisSettings = {
	readonly canImageBeAutoSet: boolean;
	readonly isFullyIntegrated: boolean;
	readonly isYoastIntegrated: boolean;
	readonly supportsFeatImage: boolean;
};

export async function init( args: Args ): Promise< void > {
	const post = await loadPostFromWordPress( args.postId );
	await initPost( {
		...post,
		date: 'none' === post.date ? false : post.date,
		followers: args.attributes.followers,
		statistics: {
			engagement: {},
			pageviews: undefined,
		},
	} );
	setEditorType(
		args.settings.isClassicEditor,
		args.settings.isElementorEditor
	);

	addTinyMCEGlobal();
	initAutoShareEndModes( args.settings.autoShareEndModes );
	initDefaultFollowers( args.settings.shouldAuthorBeFollower );
	initExternalFeaturedImage( args.attributes.externalFeatImage );
	initReferences( args.attributes.references );
	customizeQualityAnalysis( args.settings.qualityAnalysis );

	addListeners();

	keepRelatedItemsSynchronized();
} //end init()

export function listenToEditPostStore(
	callback: ( values: Dict ) => void
): void {
	let prevValues = {};
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const {
			getAutoShareEndMode,
			getAutomationSources,
			getExternalFeaturedImageAlt,
			getExternalFeaturedImageUrl,
			getPost,
			getQueryArgs,
			getSuggestedReferences,
			isAutoShareEnabled,
		} = select( NC_EDIT_POST );

		const post = getPost();
		const { highlights } = processHtml( post.content );
		const values = {
			autoShareEndMode: getAutoShareEndMode(),
			automationSources: getAutomationSources(),
			efiAlt: getExternalFeaturedImageAlt(),
			efiUrl: getExternalFeaturedImageUrl() || ( '' as Url ),
			followers: post.followers,
			highlights,
			isAutoShareEnabled: isAutoShareEnabled(),
			permalinkQueryArgs: getQueryArgs(),
			suggestedReferences: getSuggestedReferences(),
		};

		if ( ! isEqual( values, prevValues ) ) {
			callback( values );
		} //end if

		prevValues = values;
	}, NC_EDIT_POST );
} //end listenToEditPostStore()

export function renderMetaBox(
	id: string,
	Component: () => JSX.Element | null
): void {
	const el = document.getElementById( id );
	if ( ! el ) {
		return;
	} //end if

	const wrapper = el.querySelector( '.inside' );
	if ( ! wrapper ) {
		return;
	} //end if

	render( <Component />, wrapper );
} //end renderMetaBox()

export function createSocialMessageUsingSelection(
	text: string,
	links: ReadonlyArray< Url >
): void {
	text = trim( text );
	if ( isEmpty( text ) ) {
		return;
	} //end if

	const twitter = searchTwitterHandleToMention( links );
	if ( twitter ) {
		text = `${ text } /cc ${ twitter }`;
	} //end if

	text += ' {permalink}';

	const { getPost } = select( NC_EDIT_POST );
	const { openNewSocialMessageEditor } = dispatch( NC_SOCIAL_EDITOR );

	void openNewSocialMessageEditor(
		{ text },
		{
			context: 'post',
			post: getPost(),
			disabledProfileIds: getDisabledProfiles(),
		}
	);
} //end createSocialMessageUsingSelection()

// =======
// HELPERS
// =======

function addTinyMCEGlobal() {
	// eslint-disable-next-line
	( window as any ).NelioContentTinyMCE = {
		createMessage: createSocialMessageUsingSelection,
		getLinks,
		isEmpty,
	};
} //end addTinyMCEGlobal()

function searchTwitterHandleToMention( links: ReadonlyArray< Url > ) {
	if ( isEmpty( links ) ) {
		return false;
	} //end if

	const { getSocialProfilesByNetwork } = select( NC_DATA );
	if ( isEmpty( getSocialProfilesByNetwork( 'twitter' ) ) ) {
		return false;
	} //end if

	const { getReferenceByUrl } = select( NC_EDIT_POST );
	for ( const link of links ) {
		const data = getReferenceByUrl( link );
		if ( data && data.twitter ) {
			return data.twitter;
		} //end if
	} //end for

	return false;
} //end searchTwitterHandleToMention()

export async function loadPostFromWordPress(
	postId: PostId
): Promise< AwsPost > {
	return await apiFetch< AwsPost >( {
		path: `/nelio-content/v1/post/${ postId }?aws`,
	} );
} //end loadPostFromWordPress()

async function initPost( post: EditingPost ) {
	const { loadPostItems, setPost } = dispatch( NC_EDIT_POST );
	await setPost( post );
	void loadPostItems();
} //end initPost()

function initDefaultFollowers( shouldAuthorBeFollower: boolean ) {
	const { includeAuthorInFollowers } = dispatch( NC_EDIT_POST );
	void includeAuthorInFollowers( shouldAuthorBeFollower );
} //end initDefaultFollowers()

function initAutoShareEndModes(
	autoShareEndModes: ReadonlyArray< AutoShareEndMode >
) {
	if ( isEmpty( autoShareEndModes ) ) {
		return;
	} //end if
	const { setAutoShareEndModes } = dispatch( NC_EDIT_POST );
	void setAutoShareEndModes( autoShareEndModes );
} //end initAutoShareEndModes()

function initExternalFeaturedImage( {
	url,
	alt,
}: Args[ 'attributes' ][ 'externalFeatImage' ] ) {
	if ( ! url ) {
		return;
	} //end if
	const { setExternalFeaturedImage } = dispatch( NC_EDIT_POST );
	void setExternalFeaturedImage( url, alt );
} //end initExternalFeaturedImage()

function initReferences( references: ReadonlyArray< EditorialReference > ) {
	const { receiveReferences, suggestReferences } = dispatch( NC_EDIT_POST );
	void receiveReferences( references );

	const suggestions = filter( references, { isSuggestion: true } );
	if ( ! isEmpty( suggestions ) ) {
		void suggestReferences( map( suggestions, 'url' ) );
	} //end if
} //end initReferences()

function customizeQualityAnalysis( quality: QualityAnalysisSettings ) {
	updateQualityAnalysisIntegration( quality );
	updateYoastCheck( quality );
	updateFeaturedImageCheck( quality );
	updateAuthorCheck();
} //end customizeQualityAnalysis()

function updateQualityAnalysisIntegration( quality: QualityAnalysisSettings ) {
	const { markQualityAnalysisAsFullyIntegrated } = dispatch( NC_EDIT_POST );
	void markQualityAnalysisAsFullyIntegrated( !! quality.isFullyIntegrated );
} //end updateQualityAnalysisIntegration()

function updateYoastCheck( { isYoastIntegrated }: QualityAnalysisSettings ) {
	if ( isYoastIntegrated ) {
		return;
	} //end if
	const { removeQualityCheckType } = dispatch( NC_EDIT_POST );
	void removeQualityCheckType( 'nelio-content/yoast-content' );
	void removeQualityCheckType( 'nelio-content/yoast-seo' );
} //end updateYoastCheck()

function updateFeaturedImageCheck( quality: QualityAnalysisSettings ) {
	const { supportsFeatImage, canImageBeAutoSet } = quality;
	if ( ! supportsFeatImage ) {
		const { removeQualityCheckType } = dispatch( NC_EDIT_POST );
		void removeQualityCheckType( 'nelio-content/featured-image' );
		return;
	} //end if
	const { updateQualityCheckSettings } = dispatch( NC_EDIT_POST );
	void updateQualityCheckSettings( 'nelio-content/featured-image', {
		canImageBeAutoSet,
	} );
} //end updateFeaturedImageCheck()

function updateAuthorCheck() {
	const { isMultiAuthor } = select( NC_DATA );
	if ( isMultiAuthor() ) {
		return;
	} //end if
	const { removeQualityCheckType } = dispatch( NC_EDIT_POST );
	void removeQualityCheckType( 'nelio-content/author' );
} //end updateAuthorCheck()

function keepRelatedItemsSynchronized() {
	let prevDate: Maybe< string >, prevStatus: string;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const { getDate, getStatus } = select( NC_EDIT_POST );

		const date = getDate();
		const status = getStatus();

		if ( date === prevDate && status === prevStatus ) {
			return;
		} //end if
		prevDate = date;
		prevStatus = status;

		const { updateDatesInPostRelatedItems } = dispatch( NC_EDIT_POST );
		void updateDatesInPostRelatedItems();
	} );
} //end keepRelatedItemsSynchronized()

function setEditorType( isClassicEditor = false, isElementorEditor = false ) {
	const { setEditorToClassic, setEditorToElementor } =
		dispatch( NC_EDIT_POST );
	void setEditorToClassic( isClassicEditor );
	void setEditorToElementor( isElementorEditor );
} //end setEditorType()
