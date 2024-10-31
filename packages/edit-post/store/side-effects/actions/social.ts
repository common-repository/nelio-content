/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { logError, showErrorNotice } from '@nelio-content/utils';
import type { AwsPost, Dict, SocialMessage, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { processHtml } from '../../../utils';
import { store as NC_EDIT_POST } from '../../../store';

// WARNING! Don’t add a dependency with “@wordpress/editor”, as it
// should only be enqueued when the user is in the classic editor.
const EDITOR = 'core/editor';

export async function savePostAndGenerateTimeline(): Promise< void > {
	const isClassicEditor = select( NC_EDIT_POST ).isClassicEditor();
	if ( isClassicEditor ) {
		await generateTimelineInClassicEditor();
		return;
	} //end if

	const isElementorEditor = select( NC_EDIT_POST ).isElementorEditor();
	if ( isElementorEditor ) {
		await generateTimelineInElementorEditor();
		return;
	} //end if

	const isGenerating = select( NC_EDIT_POST ).isGeneratingTimeline();
	if ( isGenerating ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( true );
	try {
		await ( dispatch(
			EDITOR
		).savePost() as unknown as Promise< unknown > );
		await generateTimelineUnchecked();
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( false );
} //end savePostAndGenerateTimeline()

export async function generateTimeline(): Promise< void > {
	const isGenerating = select( NC_EDIT_POST ).isGeneratingTimeline();
	if ( isGenerating ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( true );
	await generateTimelineUnchecked();
	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( false );
} //end generateTimeline()

export async function clearTimeline(): Promise< void > {
	const postId = select( NC_EDIT_POST ).getPostId();
	if ( ! postId ) {
		return;
	} //end if

	const isClearing = select( NC_EDIT_POST ).isClearingTimeline();
	if ( isClearing ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markTimelineAsClearing( true );

	const postMessages =
		await resolveSelect( NC_DATA ).getSocialMessagesRelatedToPost( postId );

	const messageIds = postMessages
		.filter( ( m ) => m.status !== 'publish' )
		.map( ( m ) => m.id );

	await Promise.all( messageIds.map( deleteMessageOnAws ) );
	messageIds.forEach( ( id ) =>
		dispatch( NC_DATA ).removeSocialMessage( id )
	);

	await dispatch( NC_EDIT_POST ).markTimelineAsClearing( false );
} //end clearTimeline()

export async function deleteSocialMessage( messageId: Uuid ): Promise< void > {
	const isDeleting =
		select( NC_EDIT_POST ).isSocialMessageBeingDeleted( messageId );
	if ( isDeleting ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markSocialMessageAsDeleting(
		messageId,
		true
	);
	await deleteMessageOnAws( messageId );

	const message = select( NC_DATA ).getSocialMessage( messageId );
	await dispatch( NC_DATA ).removeRecurringMessages(
		message?.recurrenceGroup
	);
	await dispatch( NC_DATA ).removeSocialMessage( messageId );
	await dispatch( NC_EDIT_POST ).markSocialMessageAsDeleting(
		messageId,
		false
	);
} //end deleteSocialMessage()

// =======
// HELPERS
// =======

async function deleteMessageOnAws( messageId: Uuid ): Promise< void > {
	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		await apiFetch( {
			url: `${ apiRoot }/site/${ siteId }/social/${ messageId }/following`,
			method: 'DELETE',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );
	} catch ( _ ) {}
} //end deleteMessageOnAws()

async function generateTimelineInClassicEditor() {
	const isGenerating = select( NC_EDIT_POST ).isGeneratingTimeline();
	if ( isGenerating ) {
		return;
	} //end if
	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( true );

	const form = document.getElementById( 'post' ) as HTMLFormElement;
	if ( ! form ) {
		return;
	} //end if

	const field = document.createElement( 'input' );
	field.setAttribute( 'type', 'hidden' );
	field.setAttribute( 'name', '_nc_auto_messages' );
	field.setAttribute( 'value', 'true' );
	form.appendChild( field );
	form.submit();
} //end generateTimelineInClassicEditor()

async function generateTimelineInElementorEditor() {
	const isGenerating = select( NC_EDIT_POST ).isGeneratingTimeline();
	if ( isGenerating ) {
		return;
	} //end if

	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( true );
	try {
		elementor.saver.saveEditor( {
			onSuccess: async () => {
				await generateTimelineUnchecked();
				await dispatch( NC_EDIT_POST ).markTimelineAsGenerating(
					false
				);
			},
		} );
	} catch ( e ) {
		logError( e );
		await dispatch( NC_EDIT_POST ).markTimelineAsGenerating( false );
	}
} //end generateTimelineInElementorEditor()

async function generateTimelineUnchecked(): Promise< void > {
	let generatedMessages: SocialMessage[] = [];
	const postId = select( NC_EDIT_POST ).getPostId();
	if ( ! postId ) {
		return;
	} //end if

	try {
		const post = await apiFetch< AwsPost >( {
			path: `/nelio-content/v1/post/${ postId }?aws`,
		} );

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const messages = await apiFetch< ReadonlyArray< SocialMessage > >( {
			url: `${ apiRoot }/site/${ siteId }/post/${ postId }/social/auto`,
			method: 'POST',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: { ...post, ...processHtml( post.content ) },
		} );

		const oldMessages =
			await resolveSelect( NC_DATA ).getSocialMessageIdsRelatedToPost(
				postId
			);
		oldMessages.forEach( ( id ) =>
			dispatch( NC_DATA ).removeSocialMessage( id )
		);

		generatedMessages = messages.filter(
			( m ) => ! oldMessages.includes( m.id )
		);

		await dispatch( NC_DATA ).receiveSocialMessages( messages );
		await displayTimelineGeneratedNotice( generatedMessages );
	} catch ( e ) {
		logError( e );
		await showErrorNotice(
			e,
			_x(
				'Unknown error creating automatic messages.',
				'text',
				'nelio-content'
			),
			{ type: 'snackbar' }
		);
	} //end catch

	await dispatch( NC_EDIT_POST ).updateDatesInPostRelatedItems();
} //end generateTimelineUnchecked()

async function displayTimelineGeneratedNotice(
	generatedMessages: SocialMessage[]
) {
	const message = generatedMessages.length
		? sprintf(
				/* translators: %d: amount of messages created. */
				_x( '%d messages created', 'text', 'nelio-content' ),
				generatedMessages.length
		  )
		: _x(
				'No messages were created. Check your content and your settings.',
				'user',
				'nelio-content'
		  );

	const isClassicEditor = select( NC_EDIT_POST ).isClassicEditor();
	if ( isClassicEditor ) {
		const el = document.getElementById( 'message' );
		el?.insertAdjacentHTML(
			'afterend',
			`<div id="nc-message" class="notice notice-success is-dismissible"><p>${ message }</p><button type="button" class="notice-dismiss" onclick="document.getElementById('nc-message').remove()"><span class="screen-reader-text">${ _x(
				'Dismiss this notice.',
				'command',
				'nelio-content'
			) }</span></button></div>`
		);
		return;
	} //end if

	const isElementorEditor = select( NC_EDIT_POST ).isElementorEditor();
	const elementor = ( window as unknown as Dict ).elementor;
	if ( isElementorEditor && isElementor( elementor ) ) {
		elementor.notifications.showToast( { message } );
		return;
	} //end if

	if ( generatedMessages.length ) {
		await dispatch( NOTICES ).createSuccessNotice( message, {
			type: 'snackbar',
		} );
	} else {
		await dispatch( NOTICES ).createErrorNotice( message, {
			type: 'snackbar',
		} );
	} //end if
} //end displayTimelineGeneratedNotice()

export type Elementor = {
	readonly saver: {
		readonly saveEditor: ( args: { onSuccess: () => void } ) => void;
	};
	readonly notifications: {
		readonly showToast: ( args: { message: string } ) => void;
	};
};

export const isElementor = ( x?: unknown ): x is Elementor =>
	!! x && typeof x === 'object' && 'saver' in x;
