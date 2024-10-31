/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useState, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import createIntroJs from 'intro.js';
import { store as NC_DATA } from '@nelio-content/data';
import { getValue, setValue } from '@nelio-content/utils';
import type { IntroJs, Step as IntroJsStep } from 'intro.js';
import type { Dict, TutorialStep, Walkthrough } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ContextualHelpProps = {
	readonly component?: ( props: ComponentProps ) => JSX.Element | null;
	readonly context?: string;
	readonly walkthrough: Walkthrough;
	readonly autostart?: boolean;
	readonly delay?: number;
};

type ComponentProps = {
	readonly className: string;
	readonly runWalkthrough: () => void;
};

export const ContextualHelp = ( {
	component,
	context = '',
	walkthrough = [],
	autostart = false,
	delay = 250,
}: ContextualHelpProps ): JSX.Element | null => {
	const runWalkthrough = useWalkthroughEffect( {
		context,
		steps: walkthrough,
		autostart,
		delay,
	} );

	if ( ! runWalkthrough ) {
		return null;
	} //end if

	const Component = component || DefaultComponent;
	return (
		<Component
			className={ `nelio-content-contextual-help__${ context }-button` }
			runWalkthrough={ runWalkthrough }
		/>
	);
};

const DefaultComponent = ( { className, runWalkthrough }: ComponentProps ) => (
	<Button
		variant="tertiary"
		className={ className }
		icon="editor-help"
		onClick={ runWalkthrough }
	>
		<span className="screen-reader-text">
			{ _x( 'Show Help', 'command', 'nelio-content' ) }
		</span>
	</Button>
);

// =====
// HOOKS
// =====

function useWalkthroughEffect( {
	context,
	steps,
	autostart,
	delay,
}: {
	readonly context: string;
	readonly steps: ReadonlyArray< TutorialStep >;
	readonly autostart: boolean;
	readonly delay: number;
} ): false | ( () => void ) {
	const isAutoRunEnabled = useSelect( ( select ) =>
		select( NC_DATA ).areAutoTutorialsEnabled()
	);
	const [ isRunning, setRunning ] = useState( false );

	useEffect( () => {
		if (
			( !! steps.length && ! autostart ) ||
			! shouldRunOnStartup( context ) ||
			! isAutoRunEnabled
		) {
			return;
		} //end if
		const timeout = setTimeout( () => setRunning( true ), delay );
		return () => clearTimeout( timeout );
	} );

	useEffect( () => {
		if ( ! isRunning ) {
			return;
		} //end if
		setValue( `is-guide-${ context }-disabled`, true );

		const lastStep: TutorialStep = {
			title: _x( 'Enjoy!', 'user', 'nelio-content' ),
			intro: _x(
				'That’s all! If you want to view this guide again, please click here.',
				'user',
				'nelio-content'
			),
			active: () =>
				!! document.querySelector(
					`.nelio-content-contextual-help__${ context }-button`
				),
			element: () =>
				document.querySelector(
					`.nelio-content-contextual-help__${ context }-button`
				),
		};

		const walkthrough = createIntroJs().setOptions( {
			buttonClass:
				'button button-secondary nelio-content-walkthrough-button',
			disableInteraction: true,
			exitOnOverlayClick: false,
			overlayOpacity: 0.8,
			tooltipClass: 'nelio-content-walkthrough-tooltip',
			steps: [ ...steps, lastStep ]
				.filter(
					( s: TutorialStep ) =>
						! ( 'active' in s ) || !! s.active?.()
				)
				.map( tutorialStepToIntroStep ),
		} );

		walkthrough.onstart( () => updateNavigationButtons( walkthrough ) );

		walkthrough.onbeforechange( () => applyClicks( walkthrough ) );
		walkthrough.onafterchange( () =>
			updateNavigationButtons( walkthrough )
		);

		walkthrough.onexit( () => setRunning( false ) );

		walkthrough.start();
	}, [ isRunning ] );

	return !! steps.length && ( () => setRunning( true ) );
} //end useWalkthroughEffect()

// =======
// HELPERS
// =======

function tutorialStepToIntroStep(
	s: TutorialStep
): IntroJsStep & { extraNelioContent: TutorialStep } {
	const element = s.element?.();
	return {
		intro: s.intro,
		title: s.title,
		element: element || undefined,
		extraNelioContent: s,
	};
} //end ()

function shouldRunOnStartup( context: string ): boolean {
	return ! getValue( `is-guide-${ context }-disabled`, false );
} //end shouldRunOnStartup()

function applyClicks( introjs: IntroJs ): void {
	if ( ! introjs ) {
		return;
	} //end if
	const index = introjs.currentStep() || -1;
	const steps = ( introjs as unknown as Dict< unknown > )
		._introItems as ReadonlyArray<
		Partial< { extraNelioContent: TutorialStep } >
	>;

	const step = steps[ index ];
	step?.extraNelioContent?.elementToClick?.()?.click();
	if ( step?.extraNelioContent?.element ) {
		( step as Dict ).element =
			step.extraNelioContent.element() || undefined;
	} //end if
} //end applyClicks()

function updateNavigationButtons( introjs: IntroJs ): void {
	const { prev, next, skip } = getNavigationButtons( introjs );
	if ( ! prev || ! next || ! skip ) {
		return;
	} //end if

	prev.textContent = _x( 'Prev', 'command', 'nelio-content' );
	prev.style.display = isFirstStep( introjs ) ? 'none' : 'block';
	skip.style.display = isFirstStep( introjs ) ? 'block' : 'none';

	if ( isLastStep( introjs ) ) {
		next.classList.add( 'button-primary' );
		next.classList.remove( 'button-secondary' );
		next.textContent = _x( 'Close', 'command', 'nelio-content' );
	} else if ( isFirstStep( introjs ) ) {
		next.classList.add( 'button-primary' );
		next.textContent = _x( 'Start', 'command', 'nelio-content' );
	} else {
		next.classList.remove( 'button-primary' );
		next.classList.add( 'button-secondary' );
		next.textContent = _x( 'Next', 'command', 'nelio-content' );
	} //end if
} //end updateNavigationButtons()

type NavigationButtons = {
	readonly prev?: HTMLElement;
	readonly next?: HTMLElement;
	readonly skip?: HTMLElement;
};

function getNavigationButtons( introjs: IntroJs ): NavigationButtons {
	const buttons: ReadonlyArray< HTMLElement > = Array.from(
		document.querySelectorAll( '.nelio-content-walkthrough-button' )
	);

	const prev = buttons[ 0 ];
	const next = buttons[ 1 ];
	if ( ! prev || ! next ) {
		return {};
	} //end if

	const skip = getSkipButton( introjs, prev );

	return { prev, next, skip };
} //end getNavigationButtons()

function getSkipButton( introjs: IntroJs, prev: HTMLElement ): HTMLElement {
	const existing = document.querySelector< HTMLElement >(
		'.nelio-content-walkthrough-skip'
	);
	if ( existing ) {
		return existing;
	} //end if

	const skip = document.createElement( 'a' );
	skip.setAttribute( 'role', 'button' );
	skip.setAttribute( 'tabindex', '0' );
	skip.className = 'button button-secondary nelio-content-walkthrough-skip';
	skip.textContent = _x( 'Skip', 'command', 'nelio-content' );
	skip.style.float = 'left';
	skip.addEventListener( 'click', () => introjs.exit() );
	// phpcs:ignore
	prev.parentNode?.insertBefore( skip, prev );
	return skip;
} //end getSkipButton()

function isFirstStep( introjs: IntroJs ): boolean {
	return ! introjs.currentStep();
} //end isFirstStep()

function isLastStep( introjs: IntroJs ): boolean {
	return introjs.currentStep() === introjs._options.steps.length - 1;
} //end isLastStep()
