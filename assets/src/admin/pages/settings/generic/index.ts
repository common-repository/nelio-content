export * from './individual-settings';

// =====
// START
// =====

const form = document.getElementById( 'nelio-content-settings-form' );
form?.addEventListener( 'keypress', preventSubmissionOnEnter );

// =======
// HELPERS
// =======

function preventSubmissionOnEnter( ev: KeyboardEvent ) {
	if ( ! ev ) {
		return;
	} //end if

	const target = ( ev.target || ev.srcElement ) as HTMLElement | null;
	if ( ! target || 'submit' === target.id ) {
		return;
	} //end if

	const textarea = /textarea/i.test( target.tagName );
	if ( textarea ) {
		return;
	} //end if

	const keyCode = ev.keyCode || ev.which || ev.charCode || 0;
	if ( keyCode !== 13 ) {
		return;
	} //end if

	ev.preventDefault();
} //end preventSubmissionOnEnter()
